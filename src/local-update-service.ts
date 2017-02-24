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
  que: LocalUpdateQue = {};
  constructor(@Inject(LocalForageToken) private localForage: any) { }
  update(key, valueFunction) {
    return new Promise(resolve => {
      if (!(key in this.que)) {
        this.que[key] = {
          running: false,
          updates: [],
        };
      }
      this.que[key].updates.push({
        function: valueFunction,
        resolve: resolve
      });
      if (!this.que[key].running) {
        this.que[key].running = true;
        this.updateNext(key);
      }
    });
  }
  private updateNext(key: string) {
    if (this.que[key].updates.length === 0) {
      this.que[key].running = false;
      return;
    }
    const nextUpdate: LocalUpdate = this.que[key].updates.pop();
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

export interface LocalUpdateQue {
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
