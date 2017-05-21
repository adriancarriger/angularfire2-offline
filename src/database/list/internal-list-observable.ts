import { FirebaseListFactoryOpts } from 'angularfire2/interfaces';
import * as stringify from 'json-stringify-safe';
import { ReplaySubject } from 'rxjs';

import { EmulateList } from './emulate-list';
import { LocalUpdateService } from '../offline-storage/local-update-service';
import { OfflineWrite } from '../offline-storage/offline-write';

export class InternalListObservable<T> extends ReplaySubject<T> {
  /**
   * The Firebase path used for the related FirebaseListObservable
   */
  path: string;
  /**
   * Number of times updated
   */
  updated: number;
  /**
   * The current value of the {@link InternalListObservable}
   */
  value: any[];
  /**
   * The value preceding the current value.
   */
  private previousValue: any;
  private emulateList: EmulateList;
  /**
   * Creates the {@link InternalListObservable}
   * @param ref a reference to the related FirebaseListObservable
   * @param localUpdateService the service consumed by {@link OfflineWrite}
   */
  constructor(
    private ref,
    private localUpdateService: LocalUpdateService) {
    super(1);
    this.init();
  }
  /**
   * Emulates what would happen if the given write were to occur and shows the user that value.
   *
   * - If the state of the Firebase database is different than what we have during emulation,
   * then Firebase's state will win.
   * - For example, if your device is pushing to a list while offline it will be emulated on your
   * device immediately, but if another device makes a push to the same reference before your
   * device reconnects, then the other device's push will show first in the list.
   */
  emulate(method, value = null, key?) {
    this.value = this.emulateList.emulate(this.value, method, value, key);
    this.updateSubscribers();
  }
  /**
   * - Gets the path of the reference
   * - Subscribes to the observable so that emulation is applied after there is an initial value
   */
  init() {
    this.emulateList = new EmulateList();

    this.path = this.ref.$ref.toString().substring(this.ref.$ref.database.ref().toString().length - 1);

    this.subscribe((newValue: any) => {
      this.value = newValue;
      if (this.emulateList.que.length > 0) {
        this.value = this.emulateList.processQue(this.value);
        this.updateSubscribers();
      }
    });
  }
  /**
   * Only calls next if the new value is unique
   */
  uniqueNext(newValue) {
    if (this.updated > 1 || (stringify(this.previousValue) !== stringify(newValue)) ) {
      this.previousValue = newValue;
      this.next(newValue);
      this.updated++;
    }
  }
  /**
   * Wraps the AngularFire2 FirebaseListObservable [push](https://goo.gl/nTe7C0) method
   *
   * - Emulates a push locally
   * - Calls the AngularFire2 push method
   * - Saves the write locally in case the browser is refreshed before the AngularFire2 promise
   * completes
   */
  push(value: any) {
    const promise = this.ref.$ref.push(value);
    this.emulate('push', value, promise.key);
    OfflineWrite(
      promise,
      'object',
      `${this.path}/${promise.key}`,
      'set',
      [value],
      this.localUpdateService);
    return promise;
  }
  /**
   * Wraps the AngularFire2 FirebaseListObservable [update](https://goo.gl/oSWgqn) method
   *
   * - Emulates a update locally
   * - Calls the AngularFire2 update method
   * - Saves the write locally in case the browser is refreshed before the AngularFire2 promise
   * completes
   */
  update(key: string, value: any) {
    this.emulate('update', value, key);

    const promise = this.ref.update(key, value);
    this.offlineWrite(promise, 'update', [key, value]);
    return promise;
  }
  /**
   * Wraps the AngularFire2 FirebaseListObservable [remove](https://goo.gl/MkZTtv) method
   *
   * - Emulates a remove locally
   * - Calls the AngularFire2 remove method
   * - Saves the write locally in case the browser is refreshed before the AngularFire2 promise
   * completes
   * @param remove if you omit the `key` parameter from `.remove()` it deletes the entire list.
   */
  remove(key?: string) {
    this.emulate('remove', null, key);
    const promise = this.ref.remove(key);
    this.offlineWrite(promise, 'remove', [key]);
    return promise;
  }
   /**
   * Convenience method to save an offline write
   *
   * @param promise [the promise](https://goo.gl/5VLgQm) returned by calling an AngularFire2 method
   * @param type the AngularFire2 method being called
   * @param args an optional array of arguments used to call an AngularFire2 method taking the form of [newValue, options]
   */
  private offlineWrite(promise, type: string, args: any[]) {
    OfflineWrite(
      promise,
      'list',
      this.path,
      type,
      args,
      this.localUpdateService);
  }
  /**
   * Sends the the current {@link value} to all subscribers
   */
  private updateSubscribers() {
    this.uniqueNext(<any>this.value);
  }
}
