import {
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf } from '@angular/core';

import { AngularFireOfflineDatabase, DATABASE_PROVIDER } from './src/database';
import { LOCALFORAGE_PROVIDER } from './src/localforage';
import { ProvideOnce } from './src/provide-once';

export { ListObservable, ObjectObservable } from './src/interfaces';

@Injectable()
export class AngularFireOffline {
  constructor(public database: AngularFireOfflineDatabase) { }
}

export const ANGULAR_FIRE_OFFLINE_PROVIDER = ProvideOnce(AngularFireOffline);

@NgModule({
  imports: [],
  providers: [
    ANGULAR_FIRE_OFFLINE_PROVIDER,
    DATABASE_PROVIDER,
    LOCALFORAGE_PROVIDER
  ],
  declarations: []
})
export class AngularFireOfflineModule {
  /** @deprecated */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AngularFireOfflineModule,
      providers: []
    };
  }
}
