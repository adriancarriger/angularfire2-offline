import { Component } from '@angular/core';
import {
  AngularFireOfflineDatabase,
  AfoListObservable } from 'angularfire2-offline/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  items: AfoListObservable<any[]>;

  constructor(public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    private afoDatabase: AngularFireOfflineDatabase) {
      this.items = this.afoDatabase.list('/issues/58/list');
    }

  logout() {
    this.afoDatabase.reset();
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.setRoot(HomePage);
    });
  }

}
