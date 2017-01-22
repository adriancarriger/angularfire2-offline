import { Component } from '@angular/core';
import {
  Angularfire2OfflineService,
  ListObservable,
  ObjectObservable } from 'angularfire2-offline';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  info: ObjectObservable;
  items: ListObservable;
  constructor(
    public navCtrl: NavController,
    afo: Angularfire2OfflineService) {
    this.info = afo.object('/info');
    this.items = afo.list('/items');
  }
}
