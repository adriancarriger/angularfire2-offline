import { ReplaySubject } from 'rxjs';

import { ListObservable } from './list-observable';
import { ObjectObservable } from './object-observable';
import { LocalUpdateService } from './local-update-service';

export class ReplayItem<T> extends ReplaySubject<T> {
  constructor(
    private ref,
    private localUpdateService: LocalUpdateService) { super(); }
  asListObservable(): ListObservable<T> {
    const observable = new ListObservable<T>(this.ref, this.localUpdateService);
    (<any>observable).source = this;
    return observable;
  }
  asObjectObservable(): ObjectObservable<T> {
    const observable = new ObjectObservable<T>(this.ref, this.localUpdateService);
    (<any>observable).source = this;
    return observable;
  }
}
