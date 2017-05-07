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
