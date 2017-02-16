import {
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf } from '@angular/core';
import { ProvideOnce } from 'angular-provide-once';
import { AngularFire } from 'angularfire2';

import { AngularFireOfflineDatabase } from './src/database';
import { LOCALFORAGE_PROVIDER, LocalForageToken } from './src/localforage';

export { ListObservable } from './src/list-observable';
export { ObjectObservable } from './src/object-observable';

@Injectable()
export class AngularFireOffline {
  constructor(public database: AngularFireOfflineDatabase) { }
}

@NgModule({
  imports: [],
  providers: [
    ...ProvideOnce(AngularFireOffline, [AngularFireOfflineDatabase]),
    ...ProvideOnce(AngularFireOfflineDatabase, [AngularFire, LocalForageToken]),
    LOCALFORAGE_PROVIDER
  ],
  declarations: []
})
export class AngularFireOfflineModule { }
