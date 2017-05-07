import { Component } from '@angular/core';
import { AngularFireOfflineDatabase, AfoListObservable } from 'angularfire2-offline/database';

import { Random } from './words';

@Component({
  selector: 'app-conflict-messages',
  templateUrl: './conflict-messages.component.html'
})
export class ConflictMessagesComponent {
  messages: AfoListObservable<any[]>;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.messages = afoDatabase.list('conflict/messages', {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 5
      }
    });
  }
  sendMessage() {
    this.messages.push({
      text: `my ${Random.adjective} message`,
      timestamp: Date.now()
    });
  }
}
