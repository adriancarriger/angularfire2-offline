# Angular-CLI Offline Tutorial 📗

How to create an app that loads Firebase data and static resources while offline.

## [View Demo](https://angularfire2-offline.firebaseapp.com/)

## Steps to create project

### 1. Install [angular-cli](https://github.com/angular/angular-cli)

```bash
npm install -g angular-cli
```

### 2. Create a new project

```bash
ng new <project-name>
cd <project-name>
```

The Angular CLI's `new` command will set up the latest Angular build in a new project structure.

### 3. Test your Setup

```bash
ng serve
open http://localhost:4200
```

You should see a message that says *App works!*

### 4. Install Dependencies

```bash
npm install angularfire2-offline angularfire2 firebase --save
```

Now that you have a new project setup, install [AngularFire2Offline](https://www.npmjs.com/package/angularfire2-offline), [AngularFire2](https://www.npmjs.com/package/angularfire2) and [Firebase](https://www.npmjs.com/package/firebase) from npm.

### 5. Setup @NgModule

Open [`/src/app/app.module.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/b3eed643262c8f38f54b062c1aa664017bc85dd3/examples/angular-cli/src/app/app.module.ts), inject the Firebase providers, and specify your Firebase configuration.
This can be found in your project at [the Firebase Console](https://console.firebase.google.com):

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';

import { AppComponent } from './app.component';

// Must export the config
export const firebaseConfig = {
  apiKey: '<your-key>',
  authDomain: '<your-project-authdomain>',
  databaseURL: '<your-database-URL>',
  storageBucket: '<your-storage-bucket>'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireOfflineModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 6. Use in a component

In [`/src/app/app.component.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/b3eed643262c8f38f54b062c1aa664017bc85dd3/examples/angular-cli/src/app/app.component.ts):

```ts
import { Component } from '@angular/core';
import {
  AngularFireOffline,
  ListObservable,
  ObjectObservable } from 'angularfire2-offline';

@Component({
  selector: 'project-name-app',
  templateUrl: 'app.component.html'
})
export class MyApp {
  info: ObjectObservable<any>;
  items: ListObservable<any[]>;
  constructor(afo: AngularFireOffline) {
    this.info = afo.database.object('/info');
    this.items = afo.database.list('/items');
  }
}
```

In [`/src/app/app.component.html`](https://github.com/adriancarriger/angularfire2-offline/blob/b3eed643262c8f38f54b062c1aa664017bc85dd3/examples/angular-cli/src/app/app.component.html):

```html
<h1>{{ (info | async)?.name }}</h1>
<ul>
  <li *ngFor="let item of items | async">
    {{ item?.name }}
  </li>
</ul>
```

### 7. Run your app

```bash
ng serve
```

Run the serve command and go to `localhost:4200` in your browser.

### Result

At this point everything should be working, including offline support for your Firebase data. That won't help too much if the rest of your app doesn't work offline, so the optional following steps show how to add full offline support.

## Steps to get full offline support (optional)

The following steps are based on [this tutorial](https://coryrylan.com/blog/fast-offline-angular-apps-with-service-workers) by [Cory Rylan](https://coryrylan.com/)

### 1. Add a service worker

In [`/src/index.html`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/index.html#L13-L21) add the following just before the closing `body` tag:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker registered');
    }).catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
  }
</script>
```

### 2. Add `service-worker.js`

Create an empty file called `service-worker.js` located at [`/src/service-worker.js`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/service-worker.js)

### 2. Add assets

In [`/angular-cli.json`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/angular-cli.json#L10-L14) add `service-worker.js` to the assets array:

```json
"assets": [
  "assets",
  "favicon.ico",
  "service-worker.js"
],
```

### 3. Install sw-precache

```bash
npm install sw-precache --save-dev
```

### 4. Add `package.json` scripts

In [`/package.json`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/package.json#L13-L14) add the `sw` and `build:prod` scripts:

```json
"scripts": {
  "start": "ng serve",
  "lint": "tslint \"src/**/*.ts\"",
  "test": "ng test",
  "pree2e": "webdriver-manager update",
  "e2e": "protractor",
  "sw": "sw-precache --root=dist --config=sw-precache-config.js",
  "build:prod": "ng build --prod && npm run sw"
}
```

### 5. Create `sw-precache-config.js`

In the root of your project create a file called [`sw-precache-config.js`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/sw-precache-config.js) with the following config:

```js
module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/**.js',
    'dist/**.css'
  ]
};
```
You can also add other items to the staticFileGlobs array such as:

- `'dist/assets/**'` to cache assets
- `'dist/**.ttf'` to cache fonts

### 6. Build your app

Running the following command should result in an app that will load offline after the inital visit

```bash
npm run build:prod
```

## Testing locally (recommended)

### 1. Install lite-server

```bash
npm install live-server --save-dev
```

### 2. Add `static-serve` script

In [`/package.json`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/package.json#L14) add the `static-serve` script:

```json
"scripts": {
  "start": "ng serve",
  "lint": "tslint \"src/**/*.ts\"",
  "test": "ng test",
  "pree2e": "webdriver-manager update",
  "e2e": "protractor",
  "sw": "sw-precache --root=dist --config=sw-precache-config.js",
  "build:prod": "ng build --prod && npm run sw",
  "static-serve": "cd dist && live-server --port=4200 --host=localhost --entry-file=/index.html"
}
```

### 3. Run `static-serve`

```bash
npm run static-serve
```

### 4. Go to `localhost:4200`

At [localhost:4200](http://localhost:4200/) you should see your app running.

### 5. Disconnect internet and refresh

- **Disconnect internet**: To test if your Firebase data is being served offline, you will need to disconnect from the internet (e.g. turn off Wi-Fi). This is required because Firebase uses websokets which [cannot be disabled](http://stackoverflow.com/a/38730831/5357459) with the Chrome DevTools offline function.
- **Refresh**: After refreshing, your app should load offline

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
