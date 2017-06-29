import { FirebaseListFactoryOpts } from 'angularfire2/interfaces';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { InternalListObservable } from './internal-list-observable';
import { EmulateQuery } from './emulate-query';

export class AfoListObservable<T> extends ReplaySubject<T> {
  emulateQuery: EmulateQuery;
  /**
   * Creates the {@link AfoListObservable}
   */
  constructor(
    private internalListObservable: InternalListObservable<T>,
    private options?: FirebaseListFactoryOpts) {
      super();
      this.init();
    }
  emulate(method, value = null, key?) {
    this.internalListObservable.emulate(method, value, key);
  }
  init () {
    this.emulateQuery = new EmulateQuery();
    this.emulateQuery.setupQuery(this.options);

    this.internalListObservable
      .subscribe(x => {
        this.emulateQuery.emulateQuery(x)
          .then(newValue => this.next(<any>newValue));
      });
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
    return this.internalListObservable.push(value);
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
    return this.internalListObservable.remove(key);
  }
  uniqueNext(newValue) {
    this.internalListObservable.uniqueNext(newValue);
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
    return this.internalListObservable.update(key, value);
  }
  unsubscribe() {
    this.internalListObservable.unsubscribe();
    this.isStopped = true;
    this.closed = true;
    this.observers = null;
  }
}
