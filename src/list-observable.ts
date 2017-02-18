import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { OfflineWrite } from './offline-write';

export class ListObservable<T> extends Observable<T> {
  constructor(private ref, private localForage) {
    super();
  }
  push(value: any): firebase.database.ThenableReference {
    const promise = this.ref.push(value);
    this.offlineWrite(promise, 'push', [value]);
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
  private offlineWrite(promise: firebase.Promise<void>, type: string, args: any[]) {
    OfflineWrite(promise, 'list', this.ref.$ref.ref.key, type, args, this.localForage);
  }
}
