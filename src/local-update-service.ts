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
    if (!(key in this.que)) {
      this.que[key] = {
        running: false,
        updates: []
      };
    }
    this.que[key].updates.push(valueFunction);
    if (!this.que[key].running) {
      this.que[key].running = true;
      this.updateNext(key);
    }
  }
  private updateNext(key: string) {
    if (this.que[key].updates.length === 0) {
      this.que[key].running = false;
      return;
    }
    const nextUpdate: Function = this.que[key].updates.pop();
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
  private updateValue(key: string, valueFunction: Function) {
    return new Promise(resolve => {
      const newValue = valueFunction(this.cache[key]);
      this.cache[key] = newValue;
      this.localForage.setItem(key, newValue).then(() => {
        resolve();
      });
    });
  }
}

export interface LocalUpdateQue {
  [key: string]: {
    running: boolean;
    updates: Array<any>;
  };
}

export function LOCAL_UPDATE_SERVICE_PROVIDER_FACTORY(
  parent: LocalUpdateService,
  LocalUpdateService,
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
