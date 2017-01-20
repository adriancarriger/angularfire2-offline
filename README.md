# AngularFire2 Offline

Cache [angularfire2](https://github.com/angular/angularfire2) data for offline use

[![Build Status](http://img.shields.io/travis/adriancarriger/angularfire2-offline/master.svg?maxAge=60)](https://travis-ci.org/adriancarriger/angularfire2-offline)
[![Codecov](https://img.shields.io/codecov/c/github/adriancarriger/angularfire2-offline/master.svg?maxAge=60)](https://codecov.io/gh/adriancarriger/angularfire2-offline)
[![Dependency Status](https://img.shields.io/david/adriancarriger/angularfire2-offline/master.svg?maxAge=60)](https://david-dm.org/adriancarriger/angularfire2-offline)
[![devDependency Status](https://img.shields.io/david/dev/adriancarriger/angularfire2-offline/master.svg?maxAge=60)](https://david-dm.org/adriancarriger/angularfire2-offline?type=dev)
[![npm version](https://badge.fury.io/js/angularfire2-offline.svg)](https://badge.fury.io/js/angularfire2-offline)

## [WIP] This library is a work in progress

## Install

```bash
npm install firebase angularfire2-offline --save
```

## Setup @NgModule

```ts
import { AngularFire2OfflineModule } from 'angularfire2-offline';

@NgModule({
  imports: [
    /* Other imports here */
    AngularFire2OfflineModule.forRoot()
  ]
})
export class AppModule { }
```

## Usage

```ts
import { Component } from '@angular/core';
import { Angularfire2OfflineService, ListObservable, ObjectObservable } from 'angularfire2-offline';

@Component({
  selector: 'project-name-app',
  template: `
  <h1>{{ (info | async)?.name }}</h1>
  <ul>
    <li *ngFor="let item of items | async">
      {{ item.name }}
    </li>
  </ul>
  `
})
export class MyApp {
  info: ObjectObservable;
  items: ListObservable;
  constructor(afo: Angularfire2OfflineService) {
    this.info = afo.database.object('/info');
    this.items = afo.database.list('/items');
  }
}
```

## How it works

 - While online Firebase data is stored locally (as data changes the local store is updated)
 - While offline, local data is served if available
 - On reconnect, Observables update app with new Firebase data
 - Even while online, local data is used first when available which results in a faster load
 - If loaded from local store while online and Firebase sends changes (usually a few moments later), the changes will be sent to all subscribers and the local store will be updated.

## License

angularfire2-offline is licensed under the MIT Open Source license. For more information, see the [LICENSE](LICENSE) file in this repository.
