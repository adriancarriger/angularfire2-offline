import { ModuleWithProviders, NgModule } from '@angular/core';

import { Angularfire2OfflineService } from './src/angularfire2-offline.service';

export * from './src/angularfire2-offline.service';

@NgModule({
  imports: [],
  declarations: []
})
export class AngularFire2OfflineModule {
  /**
   * The root {@link AppModule} imports the {@link CoreModule} and adds the `providers` to the {@link AppModule}
   * providers. Recommended in the
   * [Angular 2 docs - CoreModule.forRoot](https://angular.io/docs/ts/latest/guide/ngmodule.html#core-for-root)
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AngularFire2OfflineModule,
      providers: [
        Angularfire2OfflineService
      ]
    };
  }
}
