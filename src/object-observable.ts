import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

export class ObjectObservable<T> extends Observable<T> {
  constructor(private ref: FirebaseObjectObservable<any>) {
    super();
  }
  set(value: any): firebase.Promise<void> {
    return this.ref.set(value);
  }
  update(value: Object): firebase.Promise<void> {
    return this.ref.update(value);
  }
  remove(): firebase.Promise<void> {
    return this.ref.remove();
  }
}
