import { ReplaySubject, Observable } from 'rxjs';

import { ReplayItem } from './replay-item';
/**
 * Each cacheItem is related to a Firebase reference.
 * - If loaded through the network, loaded is set to true
 * - sub is the `ReplayItem` that the is made available to the rest of the app
 */
export interface AngularFireOfflineCache {
  [cacheItem: string]: {
    listInit?: boolean;
    loaded: boolean;
    sub: ReplayItem<any>;
  };
}

export interface WriteCache {
  lastId: number;
  cache: {
    [id: number]: CacheItem;
  };
}

export interface CacheItem {
  type: string;
  ref: string;
  method: string;
  args: Array<any>;
}
