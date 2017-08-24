import { Component } from '@angular/core';
import {
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: Observable<firebase.User>;
  userId: string;

  constructor(public nav: NavController,
    public afAuth: AngularFireAuth,
    private afoDatabase: AngularFireOfflineDatabase,
    private authService: AuthService) {
      this.user = afAuth.authState;
    }

  login() {
    this.authService.loginUser().then(() => {
      this.nav.setRoot(AboutPage);
    });
  }

  logout() {
    this.afoDatabase.reset();
    this.afAuth.auth.signOut().then(() => {
      this.nav.setRoot(HomePage);
    });
  }
}
