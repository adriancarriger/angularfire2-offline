import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireOfflineModule,
    BrowserModule,
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
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
