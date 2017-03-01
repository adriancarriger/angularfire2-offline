import { Component } from '@angular/core';
import {
  AngularFireOffline,
  AfoListObservable,
  AfoObjectObservable } from 'angularfire2-offline';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  info: AfoObjectObservable<any>;
  items: AfoListObservable<any[]>;
  constructor(
    public navCtrl: NavController,
    afo: AngularFireOffline) {
    this.info = afo.database.object('/info');
    this.items = afo.database.list('/items');
  }
}
