/**
 * @module CoreModule
 */ /** */
import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseListFactoryOpts, FirebaseObjectFactoryOpts } from 'angularfire2/interfaces';
import { ReplaySubject } from 'rxjs';
import { LocalForageService } from 'ng2-localforage';

import { AngularFireOfflineCache, ObjectObservable, ListObservable } from './interfaces';
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
   * - In-memory cache containing `ReplaySubject`s that return the latest value for any given
   * Firebase reference.
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
   */
  list(key: string, query?: FirebaseListFactoryOpts): ListObservable<any[]> {
    if (!(key in this.cache)) { this.setupList(key, query); }
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
   */
  object(key: string, query?: FirebaseObjectFactoryOpts): ObjectObservable<any> {
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
          return this.localforage.getItem(`${key}/${partialKey}`).toPromise();
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
  private setList(key: string, array: Array<any>) {
    const listMap = array.reduce((p, c, i) => {
      this.localforage.setItem({key: `${key}/${c.key}`, value: c.val()});
      p[i] = c.key;
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
   */
  private setupList(key: string, query: FirebaseListFactoryOpts = {}) {
    // Create cache
    this.cache[key] = {
      loaded: false,
      sub: new ReplaySubject()
    };
    // Firebase
    query.preserveSnapshot = true;
    this.af.database.list(key, query)
      .subscribe(value => {
        this.cache[key].loaded = true;
        this.cache[key].sub.next(value.map(snap => snap.val()));
        this.setList(key, value);
      });
    // Local
    this.getList(key);
  }
}
