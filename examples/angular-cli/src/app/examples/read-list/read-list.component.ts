import { Component, OnInit } from '@angular/core';

import { AngularFireOffline, ListObservable } from 'angularfire2-offline';

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html'
})
export class ReadListComponent {
  items: ListObservable<any[]>;
  constructor(afo: AngularFireOffline) {
    this.items = afo.database.list('/items');
  }
}
