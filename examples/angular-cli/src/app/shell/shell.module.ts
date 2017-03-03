import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import 'hammerjs';

import { MessageConflictTabComponent } from './conflicts/message-conflict.component';
import { OtherConflictTabComponent } from './conflicts/other-conflict.component';
import { ToggleConflictTabComponent } from './conflicts/toggle-conflict.component';
import { WriteConflictsComponent } from './conflicts/write-conflicts.component';
import { DemoComponent } from './demo.component';
import { DemoService } from './demo.service';
import { SHELL_ROUTES } from './routes';
import {
  ReadListTabComponent,
  ReadObjectTabComponent,
  ShellComponent,
  WriteListTabComponent,
  WriteObjectTabComponent } from './shell.component';
  import { ConflictMessagesComponent } from '../examples/conflict-messages/conflict-messages.component';
  import { ConflictToggleComponent } from '../examples/conflict-toggle/conflict-toggle.component';
import { ReadListComponent } from '../examples/read-list/read-list.component';
import { ReadObjectComponent } from '../examples/read-object/read-object.component';
import { WriteListComponent } from '../examples/write-list/write-list.component';
import { WriteObjectComponent } from '../examples/write-object/write-object.component';

@NgModule({
  declarations: [
    ConflictMessagesComponent,
    ConflictToggleComponent,
    DemoComponent,
    MessageConflictTabComponent,
    OtherConflictTabComponent,
    ReadListComponent,
    ReadListTabComponent,
    ReadObjectComponent,
    ReadObjectTabComponent,
    ShellComponent,
    ToggleConflictTabComponent,
    WriteConflictsComponent,
    WriteListComponent,
    WriteListTabComponent,
    WriteObjectComponent,
    WriteObjectTabComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(SHELL_ROUTES),
  ],
  exports: [
    DemoComponent,
    MaterialModule,
    ShellComponent
  ],
  providers: [
    DemoService
  ]
})
export class ShellModule { }
