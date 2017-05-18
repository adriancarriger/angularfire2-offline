import {
  Inject,
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf } from '@angular/core';

import { LocalForageToken } from './localforage';

@Injectable()
export class LocalUpdateService {
  cache = {};
  queue: LocalUpdateQueue = {};
  constructor(@Inject(LocalForageToken) private localForage: any) { }
  update(key, valueFunction) {
    return new Promise(resolve => {
      if (!(key in this.queue)) {
        this.queue[key] = {
          running: false,
          updates: [],
        };
      }
      this.queue[key].updates.push({
        function: valueFunction,
        resolve: resolve
      });
      if (!this.queue[key].running) {
        this.queue[key].running = true;
        this.updateNext(key);
      }
    });
  }
  private updateNext(key: string) {
    if (this.queue[key].updates.length === 0) {
      this.queue[key].running = false;
      return;
    }
    const nextUpdate: LocalUpdate = this.queue[key].updates.pop();
    return new Promise(resolve => this.checkCache(key)
      .then(() => this.updateValue(key, nextUpdate)
      .then(() => this.updateNext(key))));
  }
  private checkCache(key: string) {
    return new Promise(resolve => {
      if (key in this.cache) {
        resolve();
      } else {
        this.localForage.getItem(key).then((value) => {
          this.cache[key] = value;
          resolve();
        });
      }
    });
  }
  private updateValue(key: string, localUpdate: LocalUpdate) {
    return new Promise(resolve => {
      const newValue = localUpdate.function(this.cache[key]);
      this.cache[key] = newValue;
      this.localForage.setItem(key, newValue).then(() => {
        localUpdate.resolve(newValue);
        resolve();
      });
    });
  }
}

export interface LocalUpdateQueue {
  [key: string]: {
    running: boolean;
    updates: LocalUpdate[];
  };
}

export interface LocalUpdate {
  resolve: Function;
  function: Function;
}

export function LOCAL_UPDATE_SERVICE_PROVIDER_FACTORY(
  parent: LocalUpdateService,
  token) {
  return parent || new LocalUpdateService(token);
};

export const LOCAL_UPDATE_SERVICE_PROVIDER = {
  provide: LocalUpdateService,
  deps: [
    [new Optional(), new SkipSelf(), LocalUpdateService],
    [new Inject(LocalForageToken)]
  ],
  useFactory: LOCAL_UPDATE_SERVICE_PROVIDER_FACTORY
};
