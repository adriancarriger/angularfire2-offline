# Angular CLI Offline Tutorial 📗

How to create an app that loads Firebase data and static resources while offline.

## [View Demo](https://angularfire2-offline.firebaseapp.com/)

## Legacy Versions

- You are viewing the tutorial for the latest version of AngularFire2 Offline
- Upgrading from `2.x` to `4.x` for AngularFire2? Try the [upgrade tutorial](https://github.com/adriancarriger/angularfire2-offline/blob/master/docs/version-4-upgrade.md)
- For legacy support checkout the [**`AngularFire2 2.x`** version of this tutorial](https://github.com/adriancarriger/angularfire2-offline/tree/two/examples/angular-cli#angular-cli-offline-tutorial-)

## Table of Contents

- [Setup Project](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#1-install-angular-cli)
- [Add configuration](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#5-add-configuration)
- [Setup @NgModule](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#6-setup-ngmodule)
- [Read Object](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#7-read-an-object---demo)
- [Read List](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#8-read-a-list---demo)
- [Write Object](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#9-write-an-object---demo)
- [Write List](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#10-write-a-list---demo)
- [Run App](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#11-run-your-app)
- [Full Offline Support](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#steps-to-get-full-offline-support-recommended)
- [Testing Locally](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#testing-locally-recommended)

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

### 5. Add configuration

Open [`/src/environments/environment.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/environments/environment.ts) and specify your Firebase configuration. This can be found in your project at [the Firebase Console](https://console.firebase.google.com):

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBIsrtVNmZJ9dDQleuItDsz3ZXtvzhiWv8',
    authDomain: 'https://angularfire2-offline.firebaseio.com',
    databaseURL: 'https://angularfire2-offline.firebaseio.com',
    storageBucket: 'gs://angularfire2-offline.appspot.com'
  }
};
```

### 6. Setup @NgModule

Open [`/src/app/app.module.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/app.module.ts) and inject the Firebase providers:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ...OtherComponents
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireOfflineModule,
    BrowserModule,
    ...OtherModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 7. Read an object - [Demo](https://angularfire2-offline.firebaseapp.com/read-object)

In [`/src/app/examples/read-object/read-object.component.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/examples/read-object/read-object.component.ts):

```ts
import { Component } from '@angular/core';

import { AfoObjectObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-read-object',
  templateUrl: './read-object.component.html'
})
export class ReadObjectComponent {
  info: AfoObjectObservable<any>;
  constructor(afoDatabase: AngularFireOfflineDatabase) {
    this.info = afoDatabase.object('/info');
  }
}
```

In [`/src/app/examples/read-object/read-object.component.html`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/examples/read-object/read-object.component.html):

```html
<h2>{{ (info | async)?.title }}</h2>
```

### 8. Read a list - [Demo](https://angularfire2-offline.firebaseapp.com/read-list)

In [`/src/app/examples/read-list/read-list.component.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/examples/read-list/read-list.component.ts):

```ts
import { Component } from '@angular/core';

import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html'
})
export class ReadListComponent {
  items: AfoListObservable<any[]>;
  constructor(afoDatabase: AngularFireOfflineDatabase) {
    this.items = afoDatabase.list('/items');
  }
}
```

In [`/src/app/examples/read-list/read-list.component.html`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/examples/read-list/read-list.component.html):

```html
<ul>
  <li *ngFor="let item of items | async">
    {{ item?.name }}
  </li>
</ul>
```

### 9. Write an object - [Demo](https://angularfire2-offline.firebaseapp.com/write-object)

In [`/src/app/examples/write-object/write-object.component.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/examples/write-object/write-object.component.ts):

```ts
import { Component } from '@angular/core';

import { AfoObjectObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-write-object',
  templateUrl: './write-object.component.html'
})
export class WriteObjectComponent {
  car: AfoObjectObservable<any>;
  defaultCar = {
    'tires': 4,
    'engine': 'V8',
    'type': 'Sedan',
    'maxSpeed': 80
  };
  lastSpeed: number;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.car = this.afoDatabase.object('/car');
    this.car.subscribe(car => this.lastSpeed = car['maxSpeed']);
  }
  /**
   * Update
   */
  increaseSpeed() {
    this.lastSpeed++;
    this.car.update({maxSpeed: this.lastSpeed});
  }
  /**
   * Set
   */
  reset() {
    this.car.set(this.defaultCar);
  }
  /**
   * Remove
   */
  remove(item) {
    this.afoDatabase.object(`/car/${item}`).remove();
  }
}
```

In [`/src/app/examples/write-object/write-object.component.html`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/examples/write-object/write-object.component.html):

```html
<button (click)="increaseSpeed()">Speed +1</button>
<button (click)="remove('engine')">Remove engine</button>
<button (click)="reset()">Reset</button>

<h3>JSON Result:</h3>
{{ car | async | json }}
```

### 10. Write a list - [Demo](https://angularfire2-offline.firebaseapp.com/write-list)

In [`/src/app/examples/write-list/write-list.component.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/examples/write-list/write-list.component.ts):

```ts
import { Component } from '@angular/core';

import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-write-list',
  templateUrl: './write-list.component.html'
})
export class WriteListComponent {
  groceries: AfoListObservable<any[]>;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.groceries = this.afoDatabase.list('/groceries');
  }
  addItem(newName: string) {
    this.groceries.push({ text: newName });
  }
  deleteEverything() {
    this.groceries.remove();
  }
  deleteItem(key: string) {
    this.groceries.remove(key);
  }
  prioritize(item) {
    this.groceries.update(item.$key, { text: item.text + '‼️' });
  }
  reset() {
    this.groceries.remove();
    this.groceries.push({text: 'Milk'});
    this.groceries.push({text: 'Eggs'});
    this.groceries.push({text: 'Bread'});
  }
}

```

In [`/src/app/examples/write-list/write-list.component.html`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/examples/write-list/write-list.component.html):

```html

<ul>
  <li *ngFor="let item of groceries | async">
    {{item.text}}
    <button (click)="deleteItem(item.$key)" *ngIf="item.text === 'Bread'">Make gluten free ❌ 🍞</button>
    <button (click)="prioritize(item)" *ngIf="item.text === 'Eggs'">Make {{item.text}} important ‼️</button>
  </li>
</ul>
<p *ngIf="(groceries | async)?.length === 0">List empty</p>

<button (click)="addItem('Milk')">Add Milk 🥛</button>
<button (click)="addItem('Apples')">Add Apples 🍎</button>
<button (click)="addItem('Cucumbers')">Add Cucumbers 🥒</button>
<button (click)="deleteEverything()">Remove Everything 🔥</button>
<button (click)="reset()">Reset ♻️</button>
```

### 11. Run your app

```bash
ng serve
```

Run the serve command and go to `localhost:4200` in your browser.

### Result

At this point everything should be working, including offline support for your Firebase data. That won't help too much if the rest of your app doesn't work offline, so the recommended following steps show how to add full offline support.

## Steps to get full offline support (recommended)

The following steps are based on [this tutorial](https://coryrylan.com/blog/fast-offline-angular-apps-with-service-workers) by [Cory Rylan](https://coryrylan.com/)

### 1. Add a service worker

In [`/src/index.html`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/index.html#L12-L20) add the following just before the closing `body` tag:

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

### 3. Add assets

In [`/.angular-cli.json`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/.angular-cli.json#L10-L14) add `service-worker.js` to the assets array:

```json
"assets": [
  "assets",
  "favicon.ico",
  "service-worker.js"
],
```

### 4. Install sw-precache

```bash
npm install sw-precache --save-dev
```

### 5. Add `package.json` scripts

In [`/package.json`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/package.json#L12-L13) add the `sw` and `build:prod` scripts:

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

### 6. Create `sw-precache-config.js`

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

### 7. Build your app

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
