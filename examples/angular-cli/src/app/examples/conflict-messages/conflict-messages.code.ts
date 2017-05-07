/* tslint:disable */
export const ConflictMessagesCode = {
  name: 'conflict-messages',
  html: `
<h4>Recent Message</h4>
<ul>
  <li *ngFor="let message of messages | async">
    <span>{{message.timestamp | date:'mediumTime'}} - </span>
    <span>{{message.text}}</span>
  </li>
</ul>

<button (click)="sendMessage()" md-raised-button color="accent">Send message 💬</button>
  `,
  typescript:
`
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
      text: \`my \${Random.adjective} message\`,
      timestamp: Date.now()
    });
  }
}
`,
structure: `
{
  "messages": {
    "message0": {
      "content": "Hello",
      "timestamp": 1405704370369
    },
    "message1": {
      "content": "Goodbye",
      "timestamp": 1405704395231
    },
    ...
  }
}
`,
rules: `
{
  "rules": {
    "conflict": {
      "messages": {
        ".write": "true",
        ".indexOn": ["timestamp"],
        "$message": {
          ".validate": "newData.child('timestamp').val() < (now + 5000)"
        }
      }
    }
  }
}
`
};
