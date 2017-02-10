import {
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf } from '@angular/core';
import { ProvideOnce } from 'angular-provide-once';

import { AngularFireOfflineDatabase } from './src/database';
import { LOCALFORAGE_PROVIDER } from './src/localforage';

export { ListObservable, ObjectObservable } from './src/interfaces';

@Injectable()
export class AngularFireOffline {
  constructor(public database: AngularFireOfflineDatabase) { }
}

@NgModule({
  imports: [],
  providers: [
    ProvideOnce(AngularFireOffline),
    ProvideOnce(AngularFireOfflineDatabase),
    LOCALFORAGE_PROVIDER
  ],
  declarations: []
})
export class AngularFireOfflineModule { }
