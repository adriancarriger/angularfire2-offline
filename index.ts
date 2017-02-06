import {
  Injectable,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf } from '@angular/core';
import { LocalForageModule } from 'ng2-localforage';

import { AngularFireOfflineDatabase, DATABASE_PROVIDER } from './src/database';

export { ListObservable, ObjectObservable } from './src/interfaces';

@Injectable()
export class AngularFireOffline {
  constructor(public database: AngularFireOfflineDatabase) { }
}

export function ANGULAR_FIRE_OFFLINE_PROVIDER_FACTORY(
    parentRegistry: AngularFireOffline, database: AngularFireOfflineDatabase) {
  return parentRegistry || new AngularFireOffline(database);
};

export const ANGULAR_FIRE_OFFLINE_PROVIDER = {
  provide: AngularFireOffline,
  deps: [[new Optional(), new SkipSelf(), AngularFireOffline], AngularFireOfflineDatabase],
  useFactory: ANGULAR_FIRE_OFFLINE_PROVIDER_FACTORY,
};

@NgModule({
  imports: [
    LocalForageModule.forRoot()
  ],
  providers: [
    ANGULAR_FIRE_OFFLINE_PROVIDER,
    DATABASE_PROVIDER
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
