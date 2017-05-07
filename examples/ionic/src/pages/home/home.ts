import { Component } from '@angular/core';
import {
  AngularFireOfflineDatabase,
  AfoListObservable,
  AfoObjectObservable } from 'angularfire2-offline/database';
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
    afoDatabase: AngularFireOfflineDatabase) {
    this.info = afoDatabase.object('/info');
    this.items = afoDatabase.list('/items');
  }
}
