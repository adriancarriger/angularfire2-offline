import { Component } from '@angular/core';
import {
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';

import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: Observable<firebase.User>;
  constructor(public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    private afoDatabase: AngularFireOfflineDatabase) {
      this.user = afAuth.authState;
    }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(
      'afo@example.com',
      '123456'
    ).then(() => {
      this.navCtrl.setRoot(AboutPage);
    });
  }

  logout() {
    this.afoDatabase.reset();
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.setRoot(HomePage);
    });
  }
}
