/**
 * @module CoreModule
 */ /** */
import { Inject, Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseListFactoryOpts, FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';

import { AfoListObservable } from './afo-list-observable';
import { AfoObjectObservable } from './afo-object-observable';
import { AngularFireOfflineCache, CacheItem, WriteCache } from './interfaces';
import { LocalForageToken } from './localforage';
import { LocalUpdateService } from './local-update-service';
import { WriteComplete } from './offline-write';

/**
 * @whatItDoes Wraps the [AngularFire2](https://github.com/angular/angularfire2) database methods
 * with offline read and write support. Data should persist even after a complete refresh.
 *
 * --------------------------------------------------------
 * --------------------------------------------------------
 *
 * **How it works:**
 * - While online, Firebase data is stored locally (as data changes the local store is updated)
 * - While offline, local data is served if available, and writes are stored locally
 * - On reconnect, app updates with new Firebase data, and writes are sent to Firebase
 * - Even while online, local data is used first when available which results in a faster load
 */
@Injectable()
export class AngularFireOfflineDatabase {
  /**
   * In-memory cache containing `Observables`s that provide the latest value
   * for any given Firebase object reference.
   */
  objectCache: AngularFireOfflineCache = {};
  /**
   * In-memory cache containing `Observables`s that provide the latest value
   * for any given Firebase list reference.
   */
  listCache: AngularFireOfflineCache = {};
  /**
   * Current item being processed in the localForage `WriteCache`
   */
  cacheIndex = 0;
   /**
   * A temporary collection of offline writes.
   *
   * After a refresh, the writes are collected into this queue and emulated locally. When a
   * connection is available the actual writes are made to Firebase via {@link processEmulateQue}.
   */
  emulateQue = {};
  /**
   * Contains info about offline write processing state
   *
   * - `current` is true if processing offline writes via {@link processWrites}
   * - `objectCache` and `listCache` stores any new writes that happen while processing offline writes.
   * After the offline writes have processed, the writes in objectCache and listCache are applied.
   */
  processing = {
    current: true,
    listCache: {},
    objectCache: {}
  };
  /**
   * Creates the {@link AngularFireOfflineDatabase}
   *
   * @param af Angular Fire service used to connect to Firebase
   * @param localforage Angular 2 wrapper of [localforage](https://goo.gl/4RJ7Iy) that allows
   * storing data offline using asynchronous storage (IndexedDB or WebSQL) with a simple,
   * localStorage-like API
   */
  constructor(private af: AngularFire,
    @Inject(LocalForageToken) private localForage: any,
    private localUpdateService: LocalUpdateService) {
    this.processWrites();
  }
  /**
   * Process writes made while offline since the last page refresh.
   *
   * Recursive function that will continue until all writes have processed.
   */
  processWrites() {
    this.localForage.getItem('write').then((writeCache: WriteCache) => {
      if (!writeCache) { this.processingComplete(); return; }
      const cacheId = Object.keys(writeCache.cache)[this.cacheIndex];
      this.cacheIndex++;
      if (cacheId === undefined) {
        this.processEmulateQue();
        this.processingComplete();
        return;
      }
      const cacheItem: CacheItem = writeCache.cache[cacheId];
      this[cacheItem.type](cacheItem.ref); // init item if needed
      const sub = this[`${cacheItem.type}Cache`][cacheItem.ref].sub;
      sub.emulate(cacheItem.method, ...cacheItem.args);
      if (cacheItem.type === 'object' && cacheItem.method === 'set') { this.addToEmulateQue(cacheItem); }
      this.af.database[cacheItem.type](cacheItem.ref)[cacheItem.method](...cacheItem.args)
        .then(() => WriteComplete(cacheId, this.localUpdateService));
      this.processWrites();
    });
  }
  /**
   * Returns an Observable array of Firebase snapshot data
   * - This method can be used in place of AngularFire2's list method and it will work offline
   * - Sets up a list via {@link setupList} if {@link cache} is empty for this reference.
   * - Each list item is stored as a separate object for offline use. This allows offline access to
   * the entire list or a specific object in the list if the list is stored offline.
   * - Includes AngularFire2 meta-fields [such as](https://goo.gl/VhmxQW)
   * `$key` and `$exists`
   *
   * @param key the Firebase reference for this list
   * @param options optional AngularFire2 options param. Allows all
   * [valid queries](https://goo.gl/iHiAuB)
   */
  list(key: string, options?: FirebaseListFactoryOpts): AfoListObservable<any[]> {
    if (!(key in this.listCache)) { this.setupList(key, options); }
    return this.listCache[key].sub;
  }
  /**
   * Returns an Observable object of Firebase snapshot data
   * - This method can be used in place of AngularFire2's object method and it will work offline
   * - Sets up a list via {@link setupList} if {@link cache} is empty for this reference
   * - Does not include AngularFire2 meta-fields [such as](https://goo.gl/XiwE0h)
   * `$key` or `$value`
   *
   * @param key the Firebase reference for this list
   * @param options AngularFire2 options param. Allows all [valid options](https://goo.gl/iHiAuB)
   * available [for objects](https://goo.gl/IV8DYA)
   */
  object(key: string, options?: FirebaseObjectFactoryOpts): AfoObjectObservable<any> {
    if (!(key in this.objectCache)) { this.setupObject(key, options); }
    return this.objectCache[key].sub;
  }
  /**
   * Retrives a list if locally stored on the device
   * - Lists are stored as individual objects, to allow for better offline reuse.
   * - Each locally stored list uses a map to stitch together the list from individual objects
   */
  private getList(key: string) {
    this.localForage.getItem(`read/list${key}`).then(primaryValue => {
      if (!this.listCache[key].loaded && primaryValue !== null) {
        const promises = primaryValue.map(partialKey => {
          return new Promise(resolve => {
            this.localForage.getItem(`read/object${key}/${partialKey}`).then(itemValue => {
              resolve(unwrap(partialKey, itemValue, () => itemValue !== null));
            });
          });
        });
        Promise.all(promises).then(cacheValue => {
          if (this.processing.current) {
            this.processing.listCache[key] = cacheValue;
          } else {
            this.listCache[key].sub.uniqueNext(cacheValue);
          }
        });
      }
    });
  }
  /**
   * Updates subscribers with the last value found while processing during {@link processWrites}
   */
  private processingComplete() {
    this.processing.current = false;
    ['list', 'object'].forEach(type => {
      Object.keys(this.processing[`${type}Cache`]).forEach(cacheKey => {
        this[`${type}Cache`][cacheKey].sub.uniqueNext( this.processing[`${type}Cache`][cacheKey] );
      });
    });
  }
  /**
   * - Sets up an {@link AngularFireOfflineCache} item that provides Firebase data
   * - Subscribes to the object's Firebase reference
   * - Gets the most recent locally stored non-null value and sends to all app subscribers
   * - When Firebase sends a value, the related {@link AngularFireOfflineCache} item is set to
   * loaded, the new value is sent to all app subscribers, and the value is stored locally
   *
   * @param key passed directly from {@link object}'s key param
   * @param options passed directly from {@link object}'s options param
   */
  private setupObject(key: string, options: FirebaseObjectFactoryOpts = {}) {
    // Get Firebase ref
    options.preserveSnapshot = true;
    const ref: FirebaseObjectObservable<any> = this.af.database.object(key, options);
    // Create cache
    this.objectCache[key] = {
      loaded: false,
      offlineInit: false,
      sub: new AfoObjectObservable(ref, this.localUpdateService)
    };
    // Firebase
    ref.subscribe(snap => {
      this.objectCache[key].loaded = true;
      const cacheValue = unwrap(snap.key, snap.val(), () => !isNil(snap.val()));
      if (this.processing.current) {
        this.processing.objectCache[key] = cacheValue;
      } else {
        this.objectCache[key].sub.uniqueNext( cacheValue );
      }
      this.localForage.setItem(`read/object${key}`, snap.val());
    });
    // Local
    this.localForage.getItem(`read/object${key}`).then(value => {
      if (!this.objectCache[key].loaded && value !== null) {
        const cacheValue = unwrap(key.split('/').pop(), value, () => true);
        if (this.processing.current) {
          this.processing.objectCache[key] = cacheValue;
        } else {
          this.objectCache[key].sub.uniqueNext( cacheValue );
        }
      }
    });
  }
  /**
   * Temporarily store offline writes in a que that may be part of a list.
   *
   * On init the app checks if there were previous offline writes made to objects that may belong
   * to a list. This function filters out non-qualifying writes, and puts potential items
   * in the {@link emulateQue}. After all offline writes have processed, {@link processEmulateQue}
   * runs to piece together objects that belong to a list.
   *
   * - Filters out root-level object writes because they cannot belong to a list
   * @param cacheItem an item from the local write cache
   */
  private addToEmulateQue(cacheItem: CacheItem) { // add matches to que
    // Check if root level reference
    const refItems: string[] = cacheItem.ref.split('/');
    refItems.pop();
    const potentialListRef: string = '/' + refItems.join('/');
    if (potentialListRef !== '/') {
      // Add
      if (!(potentialListRef in this.emulateQue)) {
        this.emulateQue[potentialListRef] = [];
      }
      this.emulateQue[potentialListRef].push(cacheItem);
    }
  }
  /**
   * Stores a list for offline use
   * - Stores each list item as a separate object using the relavant Firebase reference string
   * to allow offline use of the entire list or just a specific object
   * - Stores a map of all the objects, used to stitch together the list for local use
   */
  private setList(key: string, array: Array<any>) {
    const primaryValue = array.reduce((p, c, i) => {
      this.localForage.setItem(`read/object${key}/${c.key}`, c.val());
      p[i] = c.key;
      return p;
    }, []);
    this.localForage.setItem(`read/list${key}`, primaryValue);
  }
  /**
   * - Sets up a {@link AngularFireOfflineCache} item that provides Firebase data
   * - Subscribes to the list's Firebase reference
   * - Gets the most recent locally stored non-null value and sends to all app subscribers
   * via {@link getList}
   * - When Firebase sends a value this {@link AngularFireOfflineCache} item is set to loaded,
   * the new value is sent to all app subscribers, and the value is stored locally via
   * {@link setList}
   *
   * @param key passed directly from {@link list}'s key param
   * @param options passed directly from {@link list}'s options param
   */
  private setupList(key: string, options: FirebaseListFactoryOpts = {}) {
    // Get Firebase ref
    options.preserveSnapshot = true;
    const ref: FirebaseListObservable<any[]> = this.af.database.list(key, options);
    // Create cache
    this.listCache[key] = {
      loaded: false,
      offlineInit: false,
      sub: new AfoListObservable(ref, this.localUpdateService)
    };
    // Firebase
    ref.subscribe(value => {
      this.listCache[key].loaded = true;
      const cacheValue = value.map(snap => unwrap(snap.key, snap.val(), () => !isNil(snap.val())));
      if (this.processing.current) {
        this.processing.listCache[key] = cacheValue;
      } else {
        this.listCache[key].sub.uniqueNext( cacheValue );
      }
      this.setList(key, value);
    });
    // Local
    this.getList(key);
  }
  /**
   * Processes cache items that require emulation
   *
   * - only run at startup upon the complete of the {@link processWrites} recursive function
   */
  private processEmulateQue() { // process emulate que
    Object.keys(this.emulateQue).forEach(listKey => {
      if (listKey in this.listCache) {
        const sub = this.listCache[listKey].sub;
        this.emulateQue[listKey].forEach((cacheItem: CacheItem) => {
          sub.emulate('update', ...cacheItem.args, cacheItem.ref.split('/').pop());
        });
        delete this.emulateQue[listKey];
      }
    });
  }
}
/**
 * Utility function used to check if an value exists.
 */
export function isNil(obj: any): boolean {
  return obj === undefined || obj === null;
}
/**
 * Adds the properies of `$key`, `$value`, `$exists` as required by AngularFire2
 */
export function unwrap(key: string, value: any, exists) {
  let unwrapped = !isNil(value) ? value : { $value: null };
  if ((/string|number|boolean/).test(typeof value)) {
    unwrapped = { $value: value };
  }
  unwrapped.$exists = exists;
  unwrapped.$key = key;
  return unwrapped;
}
