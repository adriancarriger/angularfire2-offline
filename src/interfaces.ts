import { ReplaySubject, Observable } from 'rxjs';
/**
 * Each cacheItem is related to a Firebase reference.
 * - If loaded through the network, loaded is set to true
 * - sub is the `ReplaySubject` that the is made available to the rest of the app
 */
export interface AngularFireOfflineCache {
  [cacheItem: string]: {
    loaded: boolean;
    sub: ReplaySubject<any>;
  };
}

export interface ListObservable<T> extends Observable<T> { }
export interface ObjectObservable<T> extends Observable<T> { }
