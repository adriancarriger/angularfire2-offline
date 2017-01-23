import { Component } from '@angular/core';
import {
  AngularFireOffline,
  ListObservable,
  ObjectObservable } from 'angularfire2-offline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  info: ObjectObservable<any>;
  items: ListObservable<any[]>;
  constructor(afo: AngularFireOffline) {
    this.info = afo.database.object('/info');
    this.items = afo.database.list('/items');
  }
}
