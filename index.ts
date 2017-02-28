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
import { LocalUpdateService, LOCAL_UPDATE_SERVICE_PROVIDER } from './src/local-update-service';
export { AfoListObservable } from './src/afo-list-observable';
export { AfoObjectObservable } from './src/afo-object-observable';

@Injectable()
export class AngularFireOffline {
  constructor(public database: AngularFireOfflineDatabase) { }
}

export function ANGULARFIRE_OFFLINE_PROVIDER_FACTORY(parent: AngularFireOffline, AngularFire, token, LocalUpdateService) {
  return parent || new AngularFireOffline( new AngularFireOfflineDatabase(AngularFire, token, LocalUpdateService ));
};

export const ANGULARFIRE_OFFLINE_PROVIDER = {
  provide: AngularFireOffline,
  deps: [
    [new Optional(), new SkipSelf(), AngularFireOffline],
    AngularFire,
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
