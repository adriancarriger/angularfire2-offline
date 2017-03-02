import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';

import { AppComponent } from './app.component';
import { DemoModule } from './demo/demo.module';
import { ReadListComponent } from './examples/read-list/read-list.component';
import { ReadObjectComponent } from './examples/read-object/read-object.component';
import { WriteListComponent } from './examples/write-list/write-list.component';
import { WriteObjectComponent } from './examples/write-object/write-object.component';

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
    ReadListComponent,
    ReadObjectComponent,
    WriteListComponent,
    WriteObjectComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireOfflineModule,
    BrowserModule,
    DemoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
