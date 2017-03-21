import { ReplaySubject } from 'rxjs';

import { unwrap } from './database';
import { OfflineWrite } from './offline-write';
import { LocalUpdateService } from './local-update-service';

export class AfoObjectObservable<T> extends ReplaySubject<T> {
  path: string;
  value: any;
  que = [];
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
  remove(): firebase.Promise<void> {
    this.emulate('remove');
    const promise = this.ref.remove();
    this.offlineWrite(promise, 'remove', []);
    return promise;
  }
  set(value: any) {
    const promise: firebase.Promise<void> = this.ref.set(value);
    this.offlineWrite(promise, 'set', [value]);
    return promise;
  }
  update(value: Object) {
    this.emulate('update', value);
    const promise = this.ref.update(value);
    this.offlineWrite(promise, 'update', [value]);
    return promise;
  }
  private offlineWrite(promise: firebase.Promise<void>, type: string, args: any[]) {
    OfflineWrite(
      promise,
      'object',
      this.path,
      type,
      args,
      this.localUpdateService);
  }
  private processEmulation(method, value) {
    if (method === 'update') {
      Object.keys(value).forEach(key => this.value[key] = value[key]);
    } else {
      this.value = value;
    }
  }
  private updateSubscribers() {
    this.next(unwrap(this.ref.$ref.key, this.value, () => this.value !== null));
  }
}
