import { NgModule, ErrorHandler } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

export const firebaseConfig = {
  apiKey: 'AIzaSyCIijNJKaFfNLhlVcN_Ip8b5EiY-qy_N7w',
  authDomain: 'https://ionic-pwa-ad85b.firebaseio.com/',
  databaseURL: 'https://ionic-pwa-ad85b.firebaseio.com/',
  storageBucket: 'gs://ionic-pwa-ad85b.appspot.com'
};

@NgModule({
  declarations: [
    AboutPage,
    ContactPage,
    HomePage,
    MyApp,
    TabsPage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireOfflineModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AboutPage,
    ContactPage,
    HomePage,
    MyApp,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule { }
