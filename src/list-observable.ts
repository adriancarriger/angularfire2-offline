import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

export class ListObservable<T> extends Observable<T> {
  constructor(private ref: FirebaseListObservable<any>) {
    super();
  }
  push(value: any): firebase.database.ThenableReference {
    return this.ref.push(value);
  }
  update(key: string, value: any): firebase.Promise<void> {
    return this.ref.update(key, value);
  }
  remove(key?: string): firebase.Promise<void> {
    return this.ref.remove(key);
  }
}
