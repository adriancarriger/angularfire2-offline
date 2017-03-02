import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import 'hammerjs';

import { AppComponent } from './app.component';
import { ReadObjectComponent } from './examples/read-object/read-object.component';
import { DemoComponent } from './demo/demo.component';
import { DemoService } from './demo/demo.service';
import { ReadListComponent } from './examples/read-list/read-list.component';
import { WriteObjectComponent } from './examples/write-object/write-object.component';
import { WriteListComponent } from './examples/write-list/write-list.component';

// Must export the config
export const firebaseConfig = {
  apiKey: 'AIzaSyBIsrtVNmZJ9dDQleuItDsz3ZXtvzhiWv8',
  authDomain: 'https://angularfire2-offline.firebaseio.com',
  databaseURL: 'https://angularfire2-offline.firebaseio.com',
  storageBucket: 'gs://angularfire2-offline.appspot.com'
};

@NgModule({
  declarations: [
    AppComponent,
    ReadObjectComponent,
    DemoComponent,
    ReadListComponent,
    WriteObjectComponent,
    WriteListComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireOfflineModule,
    BrowserModule,
    HttpModule,
    MaterialModule
  ],
  providers: [DemoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
