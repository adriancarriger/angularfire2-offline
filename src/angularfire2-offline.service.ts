/**
 * @module CoreModule
 */ /** */
import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseListFactoryOpts, FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';
import { ReplaySubject, Observable } from 'rxjs';
import { LocalForageService } from 'ng2-localforage';

import { Angularfire2Offline, ObjectObservable, ListObservable } from './interfaces';
/**
 * @whatItDoes Wraps some angularfire2 read methods for returning data from Firebase with the added
 * function of storing the data locally for offline use.
 * @consumers {@link ApiService}
 * @providerScope {@link AppComponent}
 * 
 * --------------------------------------------------------
 * --------------------------------------------------------
 * 
 * **Features:**
 * - Returns real-time Firebase data via Observables
 * - While online Firebase data is stored locally (as data changes the local store is updated)
 * - While offline local data is served if available
 * - On reconnect, Observables update app with new Firebase data
 * - Even while online, local data is used first when available which results in a faster load ux
 * - If loaded from local store while online, and Firebase sends changes (usually a few moments
 * later), the changes will be sent to all subscribers and the local store will be updated right
 * away.
 * 
 */
@Injectable()
export class Angularfire2OfflineService {
  /**
   * - In-memory cache containing `ReplaySubject`s that return the latest value for any given
   * Firebase reference.
   * - That value can come from a Firebase subscription or from the device
   * if there is no internet connection.
   */
  cache: Angularfire2Offline = {};
  /**
   * Creates the {@link Angularfire2OfflineService}
   * 
   * @param af Angular Fire service used to connect to Firebase
   * @param localforage Angular 2 wrapper of [localforage](https://goo.gl/4RJ7Iy) that allows
   * storing data offline using asynchronous storage (IndexedDB or WebSQL) with a simple,
   * localStorage-like API 
   */
  constructor(
    private af: AngularFire,
    private localforage: LocalForageService) { }
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
   * @param objKey used as the object key when storing each list item as an object for offline use
   * via {@link setupList}
   */
  list(key: string, query?: FirebaseListFactoryOpts, objKey?: string): ListObservable {
    if (!(key in this.cache)) { this.setupList(key, query, objKey); }
    return this.cache[key].sub.asObservable();
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
   * @param objKey used as the object key when storing each list item as an object for offline use
   * via {@link setupList}
   */
  object(key: string, query?: FirebaseObjectFactoryOpts): ObjectObservable {
    if (!(key in this.cache)) { this.setupObject(key, query); }
    return this.cache[key].sub.asObservable();
  }
  /**
   * Retrives a list if locally stored on the device
   * - Lists are stored as individual objects, to allow for better offline reuse.
   * - Each locally stored list uses a map to stitch together the list from individual objects
   */
  private getList(key: string) {
    this.localforage.getItem(key).subscribe(listMap => {
      if (!this.cache[key].loaded && listMap !== null) {
        const promises = listMap.map(partialKey => {
          const itemKey = `${key}/${partialKey}`;
          return this.localforage.getItem(itemKey).toPromise();
        });
        Promise.all(promises).then(value => this.cache[key].sub.next(value));
      }
    });
  }
  /**
   * - Sets up a {@link Angularfire2Offline} item that provides Firebase data
   * - Subscribes to the object's Firebase reference
   * - Gets the most recent locally stored non-null value and sends to all app subscribers
   * - When Firebase sends a value this {@link Angularfire2Offline} item is set to loaded, 
   * the new value is sent to all app subscribers, and the value is stored locally
   * 
   * @param key passed directly from {@link object}'s key param
   * @param query passed directly from {@link object}'s query param 
   */
  private setupObject(key: string, query: FirebaseObjectFactoryOpts = {}) {
    // Create cache
    this.cache[key] = {
      loaded: false,
      sub: new ReplaySubject()
    };
    // Firebase
    query.preserveSnapshot = true;
    this.af.database.object(key, query)
      .map(obj => obj.val())
      .subscribe(value => {
        this.cache[key].loaded = true;
        this.cache[key].sub.next(value);
        this.localforage.setItem({key: key, value: value});
      });
    // Local
    this.localforage.getItem(key).subscribe(value => {
      if (!this.cache[key].loaded && value !== null) {
        this.cache[key].sub.next(value);
      }
    });
  }
  /**
   * Stores a list for offline use
   * - Stores each list item as a separate object using the relavant Firebase reference string
   * to allow offline use of the entire list or just a specific object
   * - Stores a map of all the objects, used to stitch together the list for local use 
   */
  private setList(key: string, array: Array<any>, objKeyPartial: string) {
    const listMap = array.reduce((p, c, i) => {
      const objKey = c[objKeyPartial];
      const storeKey = `${key}/${objKey}`;
      this.localforage.setItem({key: storeKey, value: c});
      p[i] = objKey;
      return p;
    }, []);
    this.localforage.setItem({key: key, value: listMap});
  }
  /**
   * - Sets up a {@link Angularfire2Offline} item that provides Firebase data
   * - Subscribes to the list's Firebase reference
   * - Gets the most recent locally stored non-null value and sends to all app subscribers
   * via {@link getList}
   * - When Firebase sends a value this {@link Angularfire2Offline} item is set to loaded, 
   * the new value is sent to all app subscribers, and the value is stored locally via
   * {@link setList}
   * 
   * @param key passed directly from {@link list}'s key param
   * @param query passed directly from {@link list}'s query param 
   * @param objKey passed directly from {@link list}'s objKey param
   */
  private setupList(key: string, query: FirebaseListFactoryOpts = {}, objKey?: string) {
    // Create cache
    this.cache[key] = {
      loaded: false,
      sub: new ReplaySubject()
    };
    // Firebase
    query.preserveSnapshot = true;
    this.af.database.list(key, query)
      .map(arr => arr.map(snap => snap.val()))
      .subscribe(value => {
        this.cache[key].loaded = true;
        this.cache[key].sub.next(value);
        this.setList(key, value, objKey);
      });
    // Local
    this.getList(key);
  }
}
