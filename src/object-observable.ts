import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { OfflineWrite } from './offline-write';

export class ObjectObservable<T> extends Observable<T> {
  constructor(private ref: FirebaseObjectObservable<any>, private localForage) {
    super();
  }
  set(value: any): firebase.Promise<void> {
    const promise: firebase.Promise<void> = this.ref.set(value);
    this.offlineWrite(promise, 'set', [value]);
    return promise;
  }
  update(value: Object): firebase.Promise<void> {
    const promise = this.ref.update(value);
    this.offlineWrite(promise, 'update', [value]);
    return promise;
  }
  remove(): firebase.Promise<void> {
    const promise = this.ref.remove();
    this.offlineWrite(promise, 'remove', []);
    return promise;
  }
  private offlineWrite(promise: firebase.Promise<void>, type: string, args: any[]) {
    OfflineWrite(promise, 'object', this.ref.$ref.key, type, args, this.localForage);
  }
}
