import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { DemoComponent } from './demo.component';
import { DemoService } from './demo.service';
import { ShellComponent } from './shell.component';

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    MaterialModule
  ],
  exports: [
    DemoComponent,
    MaterialModule
  ],
  providers: [
    DemoService
  ]
})
export class DemoModule { }
