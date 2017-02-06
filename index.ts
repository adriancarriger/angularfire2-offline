import { Injectable, ModuleWithProviders, NgModule } from '@angular/core';
import { LocalForageModule } from 'ng2-localforage';

import { AngularFireOfflineDatabase } from './src/database';

export { ListObservable, ObjectObservable } from './src/interfaces';

@Injectable()
export class AngularFireOffline {
  constructor(public database: AngularFireOfflineDatabase) { }
}

@NgModule({
  imports: [
    LocalForageModule.forRoot()
  ],
  declarations: []
})
export class AngularFireOfflineModule {
  /**
   * The root {@link AppModule} imports the {@link CoreModule} and adds the `providers` to the {@link AppModule}
   * providers. Recommended in the
   * [Angular 2 docs - CoreModule.forRoot](https://angular.io/docs/ts/latest/guide/ngmodule.html#core-for-root)
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AngularFireOfflineModule,
      providers: [
        AngularFireOffline,
        AngularFireOfflineDatabase
      ]
    };
  }
}
