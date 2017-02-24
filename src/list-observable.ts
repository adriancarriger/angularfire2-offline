import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { OfflineWrite } from './offline-write';
import { LocalUpdateService } from './local-update-service';

export class ListObservable<T> extends Observable<T> {
  constructor(private ref, private localUpdateService: LocalUpdateService) {
    super();
  }
  push(value: any) {
    let resolve;
    let promise = new Promise(r => resolve = r);
    const key = this.ref.$ref.push(value, () => {
      resolve();
    }).key;
    OfflineWrite(
      promise,
      'object',
      `/${this.ref.$ref.ref.key}/${key}`,
      'set',
      [value],
      this.localUpdateService);
    return promise;
  }
  update(key: string, value: any): firebase.Promise<void> {
    const promise = this.ref.update(key, value);
    this.offlineWrite(promise, 'update', [key, value]);
    return promise;
  }
  remove(key?: string): firebase.Promise<void> {
    const promise = this.ref.remove(key);
    this.offlineWrite(promise, 'remove', [key]);
    return promise;
  }
  private offlineWrite(promise, type: string, args: any[]) {
    OfflineWrite(
      promise,
      'list',
      `/${this.ref.$ref.ref.key}`,
      type, args,
      this.localUpdateService);
  }
}
