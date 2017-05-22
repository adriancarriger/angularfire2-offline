import { Component } from '@angular/core';

import {
  AngularFireOfflineDatabase,
  AfoListObservable
} from 'angularfire2-offline/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // List properties
  listEqualToA: AfoListObservable<any[]>;
  listEqualToB: AfoListObservable<any[]>;

  constructor(private afoDatabase: AngularFireOfflineDatabase) {

    // Items equal to A
    this.listEqualToA = this.afoDatabase.list('/issues/9/test', {
      query: {
        orderByChild: 'child_test',
        equalTo: 'A'
      }
    });

    // Items equal to B
    this.listEqualToB = this.afoDatabase.list('/issues/9/test', {
      query: {
        orderByChild: 'child_test',
        equalTo: 'B'
      }
    });

  }
}
