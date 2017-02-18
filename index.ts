import {
  Inject,
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf } from '@angular/core';
import { AngularFire } from 'angularfire2';

import { AngularFireOfflineDatabase } from './src/database';
import { LOCALFORAGE_PROVIDER, LocalForageToken } from './src/localforage';

export { ListObservable } from './src/list-observable';
export { ObjectObservable } from './src/object-observable';

@Injectable()
export class AngularFireOffline {
  constructor(public database: AngularFireOfflineDatabase) { }
}

export function ANGULARFIRE_OFFLINE_PROVIDER_FACTORY(parent: AngularFireOffline, AngularFire, token) {
  return parent || new AngularFireOffline( new AngularFireOfflineDatabase(AngularFire, token) );
};

export const ANGULARFIRE_OFFLINE_PROVIDER = {
  provide: AngularFireOffline,
  deps: [
    [new Optional(), new SkipSelf(), AngularFireOffline],
    AngularFire,
    [new Inject(LocalForageToken)]
  ],
  useFactory: ANGULARFIRE_OFFLINE_PROVIDER_FACTORY
};

@NgModule({
  imports: [],
  providers: [
    ANGULARFIRE_OFFLINE_PROVIDER,
    LOCALFORAGE_PROVIDER
  ],
  declarations: []
})
export class AngularFireOfflineModule { }
