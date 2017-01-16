import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Angularfire2OfflineService } from './angularfire2-offline.service';

@NgModule({
  imports: [],
  declarations: []
})
export class Angularfire2OfflineModule {
  /**
   * The root {@link AppModule} imports the {@link CoreModule} and adds the `providers` to the {@link AppModule}
   * providers. Recommended in the
   * [Angular 2 docs - CoreModule.forRoot](https://angular.io/docs/ts/latest/guide/ngmodule.html#core-for-root)
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Angularfire2OfflineModule,
      providers: [
        Angularfire2OfflineService
      ]
    };
  }
}
