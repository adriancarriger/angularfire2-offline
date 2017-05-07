import {
  Inject,
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AngularFireOfflineDatabase } from './database/database';
import { LOCALFORAGE_PROVIDER, LocalForageToken } from './database/localforage';
import { LocalUpdateService, LOCAL_UPDATE_SERVICE_PROVIDER } from './database/local-update-service';
export { AfoListObservable } from './database/afo-list-observable';
export { AfoObjectObservable } from './database/afo-object-observable';
export { AngularFireOfflineDatabase } from './database/database';

export function ANGULARFIRE_OFFLINE_PROVIDER_FACTORY(parent: AngularFireOfflineDatabase, AngularFireDatabase, token, LocalUpdateService) {
  return parent || new AngularFireOfflineDatabase(AngularFireDatabase, token, LocalUpdateService );
};

export const ANGULARFIRE_OFFLINE_PROVIDER = {
  provide: AngularFireOfflineDatabase,
  deps: [
    [new Optional(), new SkipSelf(), AngularFireOfflineDatabase],
    AngularFireDatabase,
    [new Inject(LocalForageToken)],
    LocalUpdateService
  ],
  useFactory: ANGULARFIRE_OFFLINE_PROVIDER_FACTORY
};

@NgModule({
  imports: [],
  providers: [
    ANGULARFIRE_OFFLINE_PROVIDER,
    LOCALFORAGE_PROVIDER,
    LOCAL_UPDATE_SERVICE_PROVIDER
  ],
  declarations: []
})
export class AngularFireOfflineModule { }
