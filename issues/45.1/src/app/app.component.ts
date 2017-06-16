import { Component } from '@angular/core';

import {
  AngularFireOfflineDatabase,
  AfoListObservable,
  AfoObjectObservable
} from 'angularfire2-offline/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  demoBase = '/issues/45/45-1';
  balance;
  counter = 0;
  lastUserId;
  test;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.getBalanceStream(1);
  }

  changeBalance() {
    this.counter++;
    this.afoDatabase.object(this.demoBase + '/users/' + this.lastUserId + '/balance').set(this.counter);
  }

  getBalanceStream(userId) {
    this.lastUserId = userId;
    this.afoDatabase.object(this.demoBase + '/users/' + userId + '/balance').subscribe(bal => {
      this.balance = bal.$value;
    });
  }
}
