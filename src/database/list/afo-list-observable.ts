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
    this.internalListObservable.emulate(method, value = null, key);
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
  push(value: any) {
    return this.internalListObservable.push(value);
  }
  remove(key?: string) {
    return this.internalListObservable.remove(key);
  }
  uniqueNext(newValue) {
    this.internalListObservable.uniqueNext(newValue);
  }
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
