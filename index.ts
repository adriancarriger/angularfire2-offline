import { Injectable, ModuleWithProviders, NgModule } from '@angular/core';
import { LocalForageModule } from 'ng2-localforage';

import { AngularFireOfflineDatabase, DATABASE_PROVIDER } from './src/database';
import { TOP_PROVIDER_FACTORY } from './src/top-provider-factory';

export { ListObservable, ObjectObservable } from './src/interfaces';

@Injectable()
export class AngularFireOffline {
  constructor(public database: AngularFireOfflineDatabase) { }
}

export const ANGULAR_FIRE_OFFLINE_PROVIDER = TOP_PROVIDER_FACTORY(AngularFireOffline);

@NgModule({
  imports: [
    LocalForageModule.forRoot()
  ],
  declarations: [],
  providers: [ANGULAR_FIRE_OFFLINE_PROVIDER, DATABASE_PROVIDER]
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
