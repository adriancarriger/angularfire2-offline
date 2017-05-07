# Upgrading to AngularFire2 4.0

This tutorial will help if you are upgrading an existing AngularFire2 Offline app that is already using AngularFire2 version 2.x.

## Not upgrading?

Checkout a full install tutorial for AngularFire2 Offline:

* [Angular Cli Tutorial 📗](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/angular-cli#angular-cli-offline-tutorial-)
* [Ionic Tutorial 📘](https://github.com/adriancarriger/angularfire2-offline/tree/master/examples/ionic#ionic-offline-tutorial-)

## 1. Upgrade @NgModule

Open [`/src/app/app.module.ts`](https://github.com/adriancarriger/angularfire2-offline/blob/master/examples/angular-cli/src/app/app.module.ts) and add `AngularFireDatabaseModule` to your imports:

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

## 2. Upgrade components

### Change your import

Add `/database` to your AngularFire2 Offline import

```ts
import { AfoObjectObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';
```

Replace calls to `AngularFireOffline.database` with AngularFireOfflineDatabase

#### Before

```ts
constructor(afo: AngularFireOffline) {
  afo.database.list('foo');
}
```

#### After

```ts
constructor(afoDatabase: AngularFireOfflineDatabase) {
  afoDatabase.list('foo');
}
```

#### Full Component

```ts
import { Component } from '@angular/core';
import {
  AfoListObservable,
  AfoObjectObservable,
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'project-name-app',
  template: `
  <h1>{{ (info | async)?.name }}</h1>
  <ul>
    <li *ngFor="let item of items | async">
      {{ item?.name }}
    </li>
  </ul>
  `
})
export class MyApp {
  info: AfoObjectObservable<any>;
  items: AfoListObservable<any[]>;
  constructor(afoDatabase: AngularFireOfflineDatabase) {
    this.info = afoDatabase.object('/info');
    this.items = afoDatabase.list('/items');
  }
}
```

## AngularFire2 upgrade guide

Also, checkout the [AngularFire2 upgrade guide](https://github.com/angular/angularfire2/blob/master/docs/version-4-upgrade.md).
