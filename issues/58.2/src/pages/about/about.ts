import { Component } from '@angular/core';
import {
  AngularFireOfflineDatabase,
  AfoListObservable } from 'angularfire2-offline/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { AuthService } from '../../app/auth.service';
import { PushNotificationService } from '../../app/push-notification.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  items: AfoListObservable<any[]>;

  constructor(public nav: NavController,
    public afAuth: AngularFireAuth,
    private afoDatabase: AngularFireOfflineDatabase,
    private authService: AuthService,
    private pushNotificationService: PushNotificationService) {
      this.items = this.afoDatabase.list('/issues/58/list');
    }

  performLogout() {
    // delete users device token
    this.pushNotificationService.deleteToken(this.authService.userId)
      .then(() => {
        this.authService.logoutUser()
          .then(() => this.nav.setRoot(AboutPage))
          .catch(console.log);
      })
      .catch(console.log);
  }

}
