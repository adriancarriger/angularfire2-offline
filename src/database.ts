/**
 * @module CoreModule
 */ /** */
import { Inject, Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseListFactoryOpts, FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';

import { AngularFireOfflineCache, CacheItem, WriteCache } from './interfaces';
import { ListObservable } from './list-observable';
import { LocalForageToken } from './localforage';
import { LocalUpdateService } from './local-update-service';
import { ObjectObservable } from './object-observable';
import { WriteComplete } from './offline-write';
import { ReplayItem } from './replay-item';
/**
 * @whatItDoes Wraps some angularfire2 read methods for returning data from Firebase with the added
 * function of storing the data locally for offline use.
 *
 * --------------------------------------------------------
 * --------------------------------------------------------
 *
 * **Features:**
 * - While online, Firebase data is stored locally (as data changes the local store is updated)
 * - While offline, local data is served if available
 * - On reconnect, Observables update app with new Firebase data
 * - Even while online, local data is used first when available which results in a faster load
 *
 */
@Injectable()
export class AngularFireOfflineDatabase {
  /**
   * - In-memory cache containing `ReplayItem`s that return the latest value
   * for any given Firebase reference.
   * - That value can come from a Firebase subscription or from the device if there is no
   * internet connection.
   */
  cache: AngularFireOfflineCache = {};
  /**
   * Creates the {@link AngularFireOfflineDatabase}
   *
   * @param af Angular Fire service used to connect to Firebase
   * @param localforage Angular 2 wrapper of [localforage](https://goo.gl/4RJ7Iy) that allows
   * storing data offline using asynchronous storage (IndexedDB or WebSQL) with a simple,
   * localStorage-like API
   */
  cacheIndex = 0;
  processing = {
    current: true,
    cache: {}
  };
  constructor(private af: AngularFire,
    @Inject(LocalForageToken) private localForage: any,
    private localUpdateService: LocalUpdateService) {
    this.processWrites();
  }
  processWrites() {
    this.localForage.getItem('write').then((writeCache: WriteCache) => {
      if (!writeCache) { this.processingComplete(); return; }
      const cacheId = Object.keys(writeCache.cache)[this.cacheIndex];
      this.cacheIndex++;
      if (cacheId === undefined) { this.processingComplete(); return; }
      const cacheItem: CacheItem = writeCache.cache[cacheId];
      new Promise(resolve => {
        if (cacheItem.type === 'list') {
          this.offlineListInit(cacheItem.ref)
            .then(() => resolve());
        } else {
          resolve();
        }
      }).then(() => {
        this.af.database[cacheItem.type](cacheItem.ref)[cacheItem.method](...cacheItem.args)
          .then(() => WriteComplete(cacheId, this.localUpdateService));
        this.processWrites();
      });
    });
  }
  /**
   * Returns an Observable array of Firebase snapshot data
   * - This method can be used in place of angularfire2's list method and it will work offline
   * - Sets up a list via {@link setupList} if {@link cache} is empty for this reference.
   * - Each list item is stored as a separate object for offline use. This allows offline access to
   * the entire list or a specific object in the list if the list is stored offline.
   * - Does not include angularfire2 meta-fields [such as](https://goo.gl/VhmxQW)
   * `$key` or `$exists`
   *
   * @param key the Firebase reference for this list
   * @param query optional angularfire2 query param. Allows all
   * [valid queries](https://goo.gl/iHiAuB)
   */
  list(key: string, query?: FirebaseListFactoryOpts): ListObservable<any[]> {
    if (!(key in this.cache)) { this.setupList(key, query); }
    return this.cache[key].sub.asListObservable();
  }
  /**
   * Returns an Observable object of Firebase snapshot data
   * - This method can be used in place of angularfire2's object method and it will work offline
   * - Sets up a list via {@link setupList} if {@link cache} is empty for this reference
   * - Does not include angularfire2 meta-fields [such as](https://goo.gl/XiwE0h)
   * `$key` or `$value`
   *
   * @param key the Firebase reference for this list
   * @param query optional angularfire2 query param. Allows all
   * [valid queries](https://goo.gl/iHiAuB) available [for objects](https://goo.gl/IV8DYA)
   */
  object(key: string, query?: FirebaseObjectFactoryOpts): ObjectObservable<any> {
    if (!(key in this.cache)) { this.setupObject(key, query); }
    return this.cache[key].sub.asObjectObservable();
  }
  private offlineListInit(key: string) {
    return new Promise(resolve => {
      if (this.cache[key].listInit) { return resolve(); }
      this.cache[key].listInit = true;
      this.localForage.getItem(`read${key}`).then(listMap => {
        const listObject = {};
        const promises = listMap.map(partialKey => {
          const promise =  this.localForage.getItem(`read${key}/${partialKey}`);
          promise.then(value => listObject[partialKey] = value);
          return promise;
        });
        Promise.all(promises).then(value => {
          if (!this.cache[key].loaded) { this.af.database.object(key).set(listObject); }
          resolve();
        });
      });
    });
  }
  /**
   * Retrives a list if locally stored on the device
   * - Lists are stored as individual objects, to allow for better offline reuse.
   * - Each locally stored list uses a map to stitch together the list from individual objects
   */
  private getList(key: string) {
    this.localForage.getItem(`read${key}`).then(listMap => {
      if (!this.cache[key].loaded && listMap !== null) {
        const promises = listMap.map(partialKey => {
          return new Promise(resolve => {
            this.localForage.getItem(`read${key}/${partialKey}`).then(itemValue => {
              resolve(this.unwrap(partialKey, itemValue, () => itemValue !== null));
            });
          });
        });
        Promise.all(promises).then(cacheValue => {
          if (this.processing.current) {
            this.processing.cache[key] = cacheValue;
          } else {
            this.cache[key].sub.next(cacheValue);
          }
          this.offlineListInit(key);
        });
      }
    });
  }
  private processingComplete() {
    this.processing.current = false;
    Object.keys(this.processing.cache).forEach(cacheKey => {
      this.cache[cacheKey].sub.next( this.processing.cache[cacheKey] );
    });
  }
  /**
   * - Sets up a {@link AngularFireOfflineCache} item that provides Firebase data
   * - Subscribes to the object's Firebase reference
   * - Gets the most recent locally stored non-null value and sends to all app subscribers
   * - When Firebase sends a value this {@link AngularFireOfflineCache} item is set to loaded,
   * the new value is sent to all app subscribers, and the value is stored locally
   *
   * @param key passed directly from {@link object}'s key param
   * @param query passed directly from {@link object}'s query param
   */
  private setupObject(key: string, query: FirebaseObjectFactoryOpts = {}) {
    // Get Firebase ref
    query.preserveSnapshot = true;
    const ref: FirebaseObjectObservable<any> = this.af.database.object(key, query);
    // Create cache
    this.cache[key] = {
      loaded: false,
      sub: new ReplayItem(ref, this.localUpdateService)
    };
    // Firebase
    ref.subscribe(snap => {
      this.cache[key].loaded = true;
      const cacheValue = this.unwrap(snap.key, snap.val(), snap.exists);
      if (this.processing.current) {
        this.processing.cache[key] = cacheValue;
      } else {
        this.cache[key].sub.next( cacheValue );
      }
      this.localForage.setItem(`read${key}`, snap.val());
    });
    // Local
    this.localForage.getItem(`read${key}`).then(value => {
      if (!this.cache[key].loaded) {
        const cacheValue = this.unwrap(key.split('/').pop(), value, () => value !== null);
        if (this.processing.current) {
          this.processing.cache[key] = cacheValue;
        } else {
          this.cache[key].sub.next( cacheValue );
        }
      }
    });
  }
  /**
   * Stores a list for offline use
   * - Stores each list item as a separate object using the relavant Firebase reference string
   * to allow offline use of the entire list or just a specific object
   * - Stores a map of all the objects, used to stitch together the list for local use
   */
  private setList(key: string, array: Array<any>) {
    const listMap = array.reduce((p, c, i) => {
      this.localForage.setItem(`read${key}/${c.key}`, c.val());
      p[i] = c.key;
      return p;
    }, []);
    this.localForage.setItem(`read${key}`, listMap);
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
   * @param query passed directly from {@link list}'s query param
   */
  private setupList(key: string, query: FirebaseListFactoryOpts = {}) {
    // Get Firebase ref
    query.preserveSnapshot = true;
    const ref: FirebaseListObservable<any[]> = this.af.database.list(key, query);
    // Create cache
    this.cache[key] = {
      loaded: false,
      sub: new ReplayItem(ref, this.localUpdateService)
    };
    // Firebase
    ref.subscribe(value => {
      this.cache[key].loaded = true;
      const cacheValue = value.map(snap => this.unwrap(snap.key, snap.val(), snap.exists));
      if (this.processing.current) {
        this.processing.cache[key] = cacheValue;
      } else {
        this.cache[key].sub.next( cacheValue );
      }
      this.setList(key, value);
    });
    // Local
    this.getList(key);
  }
  private unwrap(key, value, exists) {
    let unwrapped = !isNil(value) ? value : { $value: null };
    if ((/string|number|boolean/).test(typeof value)) {
      unwrapped = { $value: value };
    }
    unwrapped.$exists = exists;
    unwrapped.$key = key;
    return unwrapped;
  }
}

export function isNil(obj: any): boolean {
  return obj === undefined || obj === null;
}
