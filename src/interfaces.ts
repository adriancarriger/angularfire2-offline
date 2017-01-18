import { ReplaySubject, Observable } from 'rxjs';
/**
 * Each cacheItem is related to a Firebase reference.
 * - If loaded through the network, loaded is set to true
 * - sub is the `ReplaySubject` that the is made available to the rest of the app
 */
export interface Angularfire2Offline {
  [cacheItem: string]: {
    loaded: boolean;
    sub: ReplaySubject<any>;
  };
}

export interface ListObservable extends Observable<[any]> { }
export interface ObjectObservable extends Observable<{}> { }
