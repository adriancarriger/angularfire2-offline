import { Component } from '@angular/core';
import {
  Angularfire2OfflineService,
  ListObservable,
  ObjectObservable } from 'angularfire2-offline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  info: ObjectObservable;
  items: ListObservable;
  constructor(afo: Angularfire2OfflineService) {
    this.info = afo.object('/info');
    this.items = afo.list('/items');
  }
}
