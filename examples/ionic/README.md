# Ionic Offline Tutorial 📘

How to create an app that loads Firebase data and static resources while offline.

## [View Demo](https://ionic-pwa-ad85b.firebaseapp.com)

## Steps to create project

### 1. Install [ionic-cli](https://www.npmjs.com/package/ionic) and [cordova](https://www.npmjs.com/package/cordova)

```bash
npm install -g cordova ionic
```
### 2. Create a new project

```bash
ionic start --v2 myApp tabs
```

### 3. Test your Setup

```bash
cd myApp
ionic serve
```

You should see a message that says *Welcome to Ionic!*

### 4. Install Dependencies

```bash
npm install angularfire2-offline angularfire2 firebase --save
```

Now that you have a new project setup, install [AngularFire2Offline](https://www.npmjs.com/package/angularfire2-offline), [AngularFire2](https://www.npmjs.com/package/angularfire2) and [Firebase](https://www.npmjs.com/package/firebase) from npm.

### 5. Setup @NgModule

Open [`/src/app/app.module.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/ionic/src/app/app.module.ts), inject the Firebase providers, and specify your Firebase configuration.
This can be found in your project at [the Firebase Console](https://console.firebase.google.com):

```ts
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

```

### 6. Use in a component

In [`/src/pages/home/home.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/ionic/src/pages/home/home.ts):

```ts
import { Component } from '@angular/core';
import {
  AngularFireOffline,
  AfoListObservable,
  AfoObjectObservable } from 'angularfire2-offline';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  info: AfoObjectObservable<any>;
  items: AfoListObservable<any[]>;
  constructor(
    public navCtrl: NavController,
    afo: AngularFireOffline) {
    this.info = afo.object('/info');
    this.items = afo.list('/items');
  }
}
```
In [`/src/pages/home/home.html`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/ionic/src/pages/home/home.html):

```html
<ion-header>
  <ion-navbar>
    <ion-title>Ionic Offline Demo</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>
  <h1>{{ (info | async)?.name }}</h1>
  <ion-list>
    <ion-item class="text" *ngFor="let item of items | async">
      {{item.name}}
    </ion-item>
  </ion-list>
</ion-content>
```

### 7. Run your app

```bash
ionic serve
```

### Result

At this point everything should be working, including offline support for your Firebase data. That won't help too much if the rest of your app doesn't work offline, so the optional following steps show how to add full offline support.

## Steps to get full offline support (optional)

### 1. Add a service worker

In [`/src/index.html`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/ionic/src/index.html#L17-L23) find and uncomment the provided service worker script:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('service worker installed'))
      .catch(err => console.log('Error', err));
  }
</script>
```

### 2. Run `ionic serve`

```bash
ionic serve
```
At [localhost:8100](http://localhost:8100/) you should see your app running.

### 3. Disconnect internet and refresh

- **Disconnect internet**: To test if your Firebase data is being served offline, you will need to disconnect from the internet (e.g. turn off Wi-Fi). This is required because Firebase uses websokets which [cannot be disabled](http://stackoverflow.com/a/38730831/5357459) with the Chrome DevTools offline function.
- **Refresh**: After refreshing, your app should load offline
