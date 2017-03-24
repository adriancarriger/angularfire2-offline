import { ReplaySubject } from 'rxjs';

import { unwrap } from './database';
import { OfflineWrite } from './offline-write';
import { LocalUpdateService } from './local-update-service';

export class AfoListObservable<T> extends ReplaySubject<T> {
  path: string;
  que = [];
  value: any;
  constructor(private ref, private localUpdateService: LocalUpdateService) {
    super(1);
    this.init();
  }
  /**
   * Emulates an offline write assuming the remote data has not changed
   * @param method AngularFire2 write method to emulate
   * @param value new value to write
   * @param key optional key used with some write methods
   */
  emulate(method, value = null, key?) {
    const clonedValue = JSON.parse(JSON.stringify(value));
    if (this.value === undefined) {
      this.que.push({
        method: method,
        value: clonedValue,
        key: key
      });
      return;
    }
    this.processEmulation(method, clonedValue, key);
    this.updateSubscribers();
  }
  init() {
    this.path = this.ref.$ref.toString().substring(this.ref.$ref.database.ref().toString().length - 1);
    this.subscribe(newValue => {
      this.value = newValue;
      if (this.que.length > 0) {
        this.que.forEach(queTask => {
          this.processEmulation(queTask.method, queTask.value, queTask.key);
        });
        this.que = [];
        this.updateSubscribers();
      }
    });
  }
  push(value: any) {
    let resolve;
    let promise = new Promise(r => resolve = r);
    const key = this.ref.$ref.push(value, () => {
      resolve();
    }).key;
    this.emulate('push', value, key);
    OfflineWrite(
      promise,
      'object',
      `${this.path}/${key}`,
      'set',
      [value],
      this.localUpdateService);
    return promise;
  }
  update(key: string, value: any): firebase.Promise<void> {
    this.emulate('update', value, key);
    const promise = this.ref.update(key, value);
    this.offlineWrite(promise, 'update', [key, value]);
    return promise;
  }
  remove(key?: string): firebase.Promise<void> {
    this.emulate('remove', null, key);
    const promise = this.ref.remove(key);
    this.offlineWrite(promise, 'remove', [key]);
    return promise;
  }
  private offlineWrite(promise: firebase.Promise<void>, type: string, args: any[]) {
    OfflineWrite(
      promise,
      'list',
      this.path,
      type,
      args,
      this.localUpdateService);
  }
  /**
   * Calculates the result of a given emulation without updating subscribers of this Observable
   *
   * - this allows for the processing of many emulations before notifying subscribers
   * @param method the AngularFire2 method being emulated
   * @param value the new value to be used by the given method
   * @param key can be used for remove and required for update
   */
  private processEmulation(method, value, key) {
    if (this.value === null) {
      this.value = [];
    }
    const newValue = unwrap(key, value, () => value !== null);
    if (method === 'push') {
      let found = false;
      this.value.forEach((item, index) => {
        if (item.$key === key) {
          this.value[index] = newValue;
          found = true;
        }
      });
      if (!found) {
        this.value.push(newValue);
      }
    } else if (method === 'update') {
      let found = false;
      this.value.forEach((item, index) => {
        if (item.$key === key) {
          found = true;
          this.value[index] = newValue;
        }
      });
      if (!found) {
        this.value.push(newValue);
      }
    } else { // `remove` is the only remaining option
      if (key === undefined) {
        this.value = [];
      } else {
        this.value.forEach((item, index) => {
          if (item.$key === key) {
            this.value.splice(index, 1);
          }
        });
      }
    }
  }
  private updateSubscribers() {
    this.next(this.value);
  }
}
