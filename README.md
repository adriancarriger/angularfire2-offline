## AngularFire2 Offline

- This library is a work in progress
- Caches angularfire2 data for offline use
- Simple read-only wrapper of the [AngularFire2 module](https://github.com/angular/angularfire2)

## Features:
 - Returns real-time Firebase data via Observables
 - While online Firebase data is stored locally (as data changes the local store is updated)
 - While offline local data is served if available
 - On reconnect, Observables update app with new Firebase data
 - Even while online, local data is used first when available which results in a faster load
 - If loaded from local store while online, and Firebase sends changes (usually a few moments later), the changes will be sent to all subscribers and the local store will be updated.

## Install

```bash
npm install firebase angularfire2-offline --save
```

## Example use:

```ts
import { Component } from '@angular/core';
import { Angularfire2OfflineService, ListObservable, ObjectObservable } from 'angularfire2-offline';

@Component({
  selector: 'project-name-app',
  template: `
  <h1>{{ (item | async)?.name }}</h1>
  <ul>
    <li *ngFor="let item of items | async">
      {{ item.name }}
    </li>
  </ul>
  `
})
export class MyApp {
  item: ObjectObservable;
  items: ListObservable;
  constructor(afo: Angularfire2OfflineService) {
    this.item = af.database.object('/item');
    this.items = afo.database.list('/items');
  }
}
```

 ## License

 angularfire2-offline is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
