import { Component } from '@angular/core';
import { AngularFireOffline, AfoListObservable } from 'angularfire2-offline';

import { Random } from './words';

@Component({
  selector: 'app-conflict-messages',
  templateUrl: './conflict-messages.component.html'
})
export class ConflictMessagesComponent {
  messages: AfoListObservable<any[]>;
  constructor(private afo: AngularFireOffline) {
    this.messages = afo.database.list('conflict/messages', {
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
