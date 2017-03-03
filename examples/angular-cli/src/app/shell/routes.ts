import { Routes } from '@angular/router';

import { MessageConflictTabComponent } from './conflicts/message-conflict.component';
import { OtherConflictTabComponent } from './conflicts/other-conflict.component';
import { ToggleConflictTabComponent } from './conflicts/toggle-conflict.component';
import { WriteConflictsComponent } from './conflicts/write-conflicts.component';
import {
  ReadListTabComponent,
  ReadObjectTabComponent,
  WriteListTabComponent,
  WriteObjectTabComponent } from './shell.component';

export const SHELL_ROUTES: Routes = [
  { path: '', redirectTo: 'read-object', pathMatch: 'full' },
  { path: 'read-object', component: ReadObjectTabComponent },
  { path: 'read-list', component: ReadListTabComponent },
  { path: 'write-object', component: WriteObjectTabComponent },
  { path: 'write-list', component: WriteListTabComponent },
  {
    path: 'write-conflicts',
    component: WriteConflictsComponent,
    children: [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      { path: 'messages', component: MessageConflictTabComponent },
      { path: 'toggle', component: ToggleConflictTabComponent },
      { path: 'other', component: OtherConflictTabComponent }
    ]
  }
];
