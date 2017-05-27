import { Component } from '@angular/core';
import {
  AngularFireOfflineDatabase,
  AfoListObservable } from 'angularfire2-offline/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: AfoListObservable<any[]>;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {

    this.items = afoDatabase.list('/items');

  }
}
