import * as firebase from 'firebase/app';
import { ReplaySubject } from 'rxjs';

import { unwrap } from '../database';
import { OfflineWrite } from '../offline-storage/offline-write';
import { LocalUpdateService } from '../offline-storage/local-update-service';
const stringify = require('json-stringify-safe');

export class AfoObjectObservable<T> extends ReplaySubject<T> {
  /**
   * The Firebase path used for the related FirebaseObjectObservable
   */
  path: string;
  /**
   * An array used to store write operations that require an initial value to be set
   * in {@link value} before being applied
   */
  que = [];
  /**
   * Number of times updated
   */
  updated: number;
  /**
   * The current value of the {@link AfoObjectObservable}
   */
  value: any;
  /**
   * The value preceding the current value.
   */
  private previousValue: any;
  /**
   * Creates the {@link AfoObjectObservable}
   * @param ref a reference to the related FirebaseObjectObservable
   * @param localUpdateService the service consumed by {@link OfflineWrite}
   */
  constructor(private ref, private localUpdateService: LocalUpdateService) {
    super(1);
    this.init();
  }
  /**
   * Emulates an offline write assuming the remote data has not changed
   * @param method AngularFire2 write method to emulate
   * @param value new value to write
   */
  emulate(method, value = null) {
    const clonedValue = JSON.parse(JSON.stringify(value));
    if (this.value === undefined) {
      this.que.push({
        method: method,
        value: clonedValue
      });
      return;
    }
    this.processEmulation(method, clonedValue);
    this.updateSubscribers();
  }
  /**
   * - Gets the path of the reference
   * - Subscribes to the observable so that emulation is applied after there is an initial value
   */
  init() {
    this.path = this.ref.$ref.toString().substring(this.ref.$ref.database.ref().toString().length - 1);
    this.subscribe(newValue => {
      this.value = newValue;
      if (this.que.length > 0) {
        this.que.forEach(queTask => {
          this.processEmulation(queTask.method, queTask.value);
        });
        this.que = [];
        this.updateSubscribers();
      }
    });
  }
  /**
   * Wraps the AngularFire2 FirebaseObjectObservable [remove](https://goo.gl/xHDx1c) method
   *
   * - Emulates a remove locally
   * - Calls the AngularFire2 remove method
   * - Saves the write locally in case the browser is refreshed before the AngularFire2 promise
   * completes
   */
  remove(): Promise<void> {
    this.emulate('remove');
    const promise = this.ref.remove();
    promise['offline'] = this.offlineWrite(promise, 'remove', []);
    return promise;
  }
  /**
   * Wraps the AngularFire2 FirebaseObjectObservable [set](https://goo.gl/78u3XB) method
   *
   * - Emulates a set locally
   * - Calls the AngularFire2 set method
   * - Saves the write locally in case the browser is refreshed before the AngularFire2 promise
   * completes
   * @param value the new value to set for the related Firebase reference
   */
  set(value: any) {
    const promise: Promise<void> = this.ref.set(value);
    promise['offline'] = this.offlineWrite(promise, 'set', [value]);
    return promise;
  }
  /**
   * Wraps the AngularFire2 FirebaseObjectObservable
   * [update](https://goo.gl/o2181q) method
   *
   * - Emulates a update locally
   * - Calls the AngularFire2 update method (this will not reflect locally if there is no initial
   * value)
   * - Saves the write locally in case the browser is refreshed before the AngularFire2 promise
   * completes
   * @param update the update object required by AngularFire2
   */
  update(value: Object) {
    this.emulate('update', value);
    const promise = this.ref.update(value);
    promise['offline'] = this.offlineWrite(promise, 'update', [value]);
    return promise;
  }
  /**
   * Only calls next if the new value is unique
   */
  uniqueNext(newValue) {
    if (this.updated > 1 || (this.comparableValue(this.previousValue) !== this.comparableValue(newValue) )) {
      this.previousValue = newValue;
      this.next(newValue);
      this.updated++;
    }
  }
  /**
   * Convenience method to save an offline write
   *
   * @param promise
   * [the promise](https://goo.gl/ncNG19)
   * returned by calling an AngularFire2 method
   * @param type the AngularFire2 method being called
   * @param args an optional array of arguments used to call an AngularFire2 method taking the form of [newValue, options]
   */
  private offlineWrite(promise: Promise<void>, type: string, args: any[]) {
    return OfflineWrite(
      promise,
      'object',
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
   */
  private processEmulation(method, value) {
    if (method === 'update') {
      Object.keys(value).forEach(key => this.value[key] = value[key]);
    } else {
      this.value = value;
    }
  }
  /**
   * Sends the the current {@link value} to all subscribers
   */
  private updateSubscribers() {
    this.uniqueNext(unwrap(this.ref.$ref.key, this.value, () => this.value !== null));
  }
  private comparableValue(initialValue) {
    if (initialValue && '$value' in initialValue) {
      return stringify(initialValue.$value);
    }
    return stringify(initialValue);
  }
}
