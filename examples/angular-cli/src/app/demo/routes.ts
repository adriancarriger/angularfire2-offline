import { Routes } from '@angular/router';

import {
  ReadListTabComponent,
  ReadObjectTabComponent,
  WriteListTabComponent,
  WriteObjectTabComponent } from './shell';

export const DEMO_ROUTES: Routes = [
  { path: '', redirectTo: 'read-object', pathMatch: 'full' },
  { path: 'read-object', component: ReadObjectTabComponent },
  { path: 'read-list', component: ReadListTabComponent },
  { path: 'write-object', component: WriteObjectTabComponent },
  { path: 'write-list', component: WriteListTabComponent }
];
