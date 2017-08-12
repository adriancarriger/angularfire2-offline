/**
 * @module CoreModule
 */ /** */
import { Inject, Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseListFactoryOpts, FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';

import { InternalListObservable } from './list/internal-list-observable';
import { AfoListObservable } from './list/afo-list-observable';
import { AfoObjectObservable } from './object/afo-object-observable';
import { AngularFireOfflineCache, CacheItem, WriteCache } from './interfaces';
import { LocalForageToken } from './offline-storage/localforage';
import { LocalUpdateService } from './offline-storage/local-update-service';
import { WriteComplete } from './offline-storage/offline-write';

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
  offlineWrites = {
    writeCache: undefined,
    skipEmulation: {}
  };
  /**
   * Creates the {@link AngularFireOfflineDatabase}
   *
   * @param af Angular Fire service used to connect to Firebase
   * @param localforage Angular 2 wrapper of [localforage](https://goo.gl/4RJ7Iy) that allows
   * storing data offline using asynchronous storage (IndexedDB or WebSQL) with a simple,
   * localStorage-like API
   */
  constructor(private af: AngularFireDatabase,
    @Inject(LocalForageToken) private localForage: any,
    private localUpdateService: LocalUpdateService) {
      this.processWritesInit().then(() => this.processWrites());
  }
  /**
   * Happens once before the recurrsive `processWrites` function
   */
  processWritesInit() {
    return this.localForage.getItem('write')
      .then((writeCache: WriteCache) => {
        this.offlineWrites.writeCache = writeCache;
        if (!this.offlineWrites.writeCache || !this.offlineWrites.writeCache.cache) { return; }
        /**
         * The gathers a list of references that contain a `set` or `remove`
         *
         * Emulation will not be called inside `processWrites` for these references.
         */
        this.offlineWrites.skipEmulation = Object.keys(this.offlineWrites.writeCache.cache)
          .map(key => this.offlineWrites.writeCache.cache[key])
          .reduce((p, c) => {
            if (['set', 'remove'].find(method => method === c.method)) {
              p[c.ref] = true;
            }
            return p;
          }, {});
      });
  }
  /**
   * Process writes made while offline since the last page refresh.
   *
   * Recursive function that will continue until all writes have processed.
   */
  processWrites() {
    // If there are now offline writes to process
    if (!this.offlineWrites.writeCache) { this.processingComplete(); return; }
    // Get current `cacheId` to process
    const cacheId = Object.keys(this.offlineWrites.writeCache.cache)[this.cacheIndex];
    // Increment cacheIndex for next item in this recursive function
    this.cacheIndex++;
    /**
     * If all items have finished processing then call the final steps and
     * end recursive functino calls
     */
    if (cacheId === undefined) {
      this.processEmulateQue();
      this.processingComplete();
      return;
    }
    // `cacheItem` is the current offline write object to process
    const cacheItem: CacheItem = this.offlineWrites.writeCache.cache[cacheId];
    // initialize the list or object (it will only init if needed)
    this[cacheItem.type](cacheItem.ref);
    // Gets the observable for the current reference
    const sub = this[`${cacheItem.type}Cache`][cacheItem.ref].sub;
    /**
     * Emulates the current state given what is known about the reference
     *
     * - This is tricky because unless there is a `set` or `remove` we don't know what the
     * eventual state will be when a connection is made to Firebase.
     * - We don't want to assume that the current state of our app is true if there is
     * just a `push` or `update`.
     * - However, with a `remove` or `set` we do know for sure that the enitre state is being changed.
     * - The `/read` local storage state is only updated if there is a `remove` or `set`
     * - Therefore, skip emulation for a reference if there `set` or `remove` is present
     * in any offline write operations.
     */
    if (!(cacheItem.ref in this.offlineWrites.skipEmulation)) {
      sub.emulate(cacheItem.method, ...cacheItem.args);
    }
    /**
     * If an object is set and that object is also part of a list, then the list observable should
     * also be update. Because this is only updating a list and we cannot know the Firebase state
     * of that list, the change should be emulated.
     */
    if (cacheItem.type === 'object' && cacheItem.method === 'set') { this.addToEmulateQue(cacheItem); }
    /**
     * Calls the original AngularFire2 method with the original arguments
     *
     * This simply replays the writes in the order that was given by the app.
     */
    this.af[cacheItem.type](cacheItem.ref)[cacheItem.method](...cacheItem.args)
      /**
       * When the write is made to Firebase it will then be removed from the offline writes (`write`)
       * portion of the device's storage and the resulting state will be stored under `read/` as usual.
       */
      .then(() => WriteComplete(cacheId, this.localUpdateService));
    // Re-calls this (recursive) function
    this.processWrites();
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
    this.setupList(key, options);
    return new AfoListObservable(this.listCache[key].sub, options);
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
   * Unsubscribes from all firebase subscriptions and clears the cache
   *
   * - run before e.g. logout to make sure there are no permission errors.
   * - will cause data loss of offline writes that have not syncronized with Firebase
   */
  reset(optionalRef?: string) {
    if (optionalRef) {
      this.resetRef(optionalRef);
    } else {
      this.resetAll();
    }
  };
  /**
   * Removes a specific reference from memeory and device storage
   */
  private resetRef(key: string) {
    if (key in this.objectCache) {
      this.objectCache[key].sub.uniqueNext(null);
      this.objectCache[key].sub.unsubscribe();
      this.objectCache[key].firebaseSubscription.unsubscribe();
      delete this.objectCache[key];
    }
    if (key in this.listCache) {
      this.listCache[key].sub.uniqueNext(null);
      this.listCache[key].sub.unsubscribe();
      this.listCache[key].firebaseSubscription.unsubscribe();
      delete this.listCache[key];
    }
    // Check if list
    this.localForage.getItem(`read/list${key}`).then(primaryValue => {
      if (primaryValue === null) {
        // key refers to a object
        this.localForage.removeItem(`read/object${key}`);
      } else {
        // key refers to a list
        primaryValue.map(partialKey => {
          // Remove object from list
          this.localForage.removeItem(`read/object${key}/${partialKey}`);
        });
        // Remove list
        this.localForage.removeItem(`read/list${key}`);
        // Remove pending writes
        this.localForage.removeItem('write');
      }
    });
  }
  /**
   * Removes all data from memory and device storage
   */
  private resetAll() {
    Object.keys(this.objectCache).forEach(key => {
      this.objectCache[key].firebaseSubscription.unsubscribe();
    });
    Object.keys(this.listCache).forEach(key => {
      this.listCache[key].firebaseSubscription.unsubscribe();
    });
    this.objectCache = {};
    this.listCache = {};
    this.localForage.clear();
  }
  private getListFirebase(key: string) {
    const options = this.listCache[key].firebaseOptions;
    const usePriority = options && options.query && options.query.orderByPriority;
    // Get Firebase ref
    if (this.listCache[key].firebaseSubscription) {
      this.listCache[key].firebaseSubscription.unsubscribe();
    }
    const ref: FirebaseListObservable<any[]> = this.af.list(key, options);
    // Create cache observable if none exists
    if (!this.listCache[key].sub) {
      this.listCache[key].sub = new InternalListObservable(ref, this.localUpdateService);
    }
    // Firebase
    this.listCache[key].firebaseSubscription = ref.subscribe(value => {
      this.listCache[key].loaded = true;
      const cacheValue = value.map(snap => {
        const priority = usePriority ? snap.getPriority() : null;
        return unwrap(snap.key, snap.val(), () => !isNil(snap.val()), priority);
      });
      if (this.processing.current) {
        this.processing.listCache[key] = cacheValue;
      } else {
        this.listCache[key].sub.uniqueNext( cacheValue );
      }
      this.setList(key, value);
    });

  }
  /**
   * Retrives a list if locally stored on the device
   * - Lists are stored as individual objects, to allow for better offline reuse.
   * - Each locally stored list uses a map to stitch together the list from individual objects
   */
  private getListLocal(key: string) {
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
    const ref: FirebaseObjectObservable<any> = this.af.object(key, options);
    // Create cache
    this.objectCache[key] = {
      loaded: false,
      offlineInit: false,
      sub: new AfoObjectObservable(ref, this.localUpdateService)
    };

    // Firebase
    this.objectCache[key].firebaseSubscription = ref.subscribe(snap => {
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
      const itemValue = c.val();
      const priority = c.getPriority();
      if (priority) { itemValue.$priority = priority; }
      this.localForage.setItem(`read/object${key}/${c.key}`, itemValue);
      p[i] = c.key;
      return p;
    }, []);
    this.localForage.setItem(`read/list${key}`, primaryValue);
  }
  /**
   * - Sets up a {@link AngularFireOfflineCache} item that provides Firebase data
   * - Subscribes to the list's Firebase reference
   * - Gets the most recent locally stored non-null value and sends to all app subscribers
   * via {@link getListLocal}
   * - When Firebase sends a value this {@link AngularFireOfflineCache} item is set to loaded,
   * the new value is sent to all app subscribers, and the value is stored locally via
   * {@link setList}
   *
   * @param key passed directly from {@link list}'s key param
   * @param options passed directly from {@link list}'s options param
   */
  private setupList(key: string, options: FirebaseListFactoryOpts = {}) {
    // Create cache if none exists
    if (!(key in this.listCache)) {
      this.listCache[key] = {
        loaded: false,
        offlineInit: false,
        sub: undefined,
        options: [],
        firebaseOptions: undefined
      };
      // Local
      this.getListLocal(key);
    }
    // Store options
    this.listCache[key].options.push(options);
    // Firebase
    if (this.optionsHaveChanged(key)) {
      this.getListFirebase(key);
    }
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
          sub.emulate('update', cacheItem.ref.split('/').pop(), ...cacheItem.args);
        });
        delete this.emulateQue[listKey];
      }
    });
  }
  private optionsHaveChanged(key: string): boolean {
    const initialOptions = this.listCache[key].firebaseOptions;
    // Base options
    const newOptions = {
      preserveSnapshot: true,
      query: { }
    };

    if (this.listCache[key].options.length === 1) {
      newOptions.query = this.listCache[key].options[0].query;
    } else {
      // Get the entire list, run query locally
    }

    this.listCache[key].firebaseOptions = newOptions;
    return JSON.stringify(initialOptions) !== JSON.stringify(newOptions);
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
export function unwrap(key: string, value: any, exists, priority = null) {
  let primitive = (/string|number|boolean/).test(typeof value);
  let unwrapped = isNil(value) || primitive ? { } : value;

  // Change Nil values to null
  if (isNil(value)) {
    Object.defineProperty(unwrapped, '$value', {
      enumerable: false,
      value: null
    });
   }

  let initialValues = { key, value, exists, priority };

  return ['value', 'exists', 'key', 'priority'].reduce((p, c) => {
    if ((c === 'value' && !primitive ) || isNil(initialValues[c])) { return p; }
    Object.defineProperty(p, `$${c}`, {
      enumerable: false,
      value: initialValues[c]
    });
    return p;
  }, unwrapped);
}
