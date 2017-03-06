import { Component } from '@angular/core';

import {
  AngularFireOffline,
  AfoListObservable,
  AfoObjectObservable
} from 'angularfire2-offline';

import { AngularFire } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authService = {userId: 'TaMPvE9d0nSM6iLqBWoz3wTdJ0E3'};
  base = '/issues/9';
  db;
  moData;
  fullData;
  constructor(
    private af: AngularFire,
    private afo: AngularFireOffline) {
    // Example
    this.db = this.afo.database;
    this.moData = this.db.list(this.base + '/personal/routines/' + this.authService.userId, {
      query: {
        orderByChild: 'day',
        equalTo: 0
      }
    });
    // Full list data without query
    this.fullData = this.af.database.list(this.base + '/personal/routines/' + this.authService.userId);
  }
  addItem(day) {
    this.moData.push({
      day: day,
      description: '',
      timestamp: 1488662446111,
      title: `Day-${day}`
    });
  }
}
