import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';

import { AppComponent } from './app.component';
import { ReadObjectComponent } from './examples/read-object/read-object.component';
import { DemoComponent } from './demo/demo.component';
import { DemoService } from './demo.service';
import { ReadListComponent } from './examples/read-list/read-list.component';
import { SetObjectComponent } from './examples/set-object/set-object.component';

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
    SetObjectComponent
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
