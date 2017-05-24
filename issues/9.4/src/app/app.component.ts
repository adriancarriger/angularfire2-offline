import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
  urlPath = '/issues/9/9-4';
  read;
  notRead;

  constructor(private afoDatabase: AngularFireOfflineDatabase) {

    // First query
    this.query(this.urlPath, 'READ').subscribe((readResultList) => {
      console.log('\n\nQueries matching read:', readResultList);
      this.read = readResultList;

       // Second query
      this.query(this.urlPath, 'NOT_READ').subscribe((unReadList) => {
        console.log('\n\nQueries matching not read:', unReadList);
        this.notRead = unReadList;
      });
    });

  }

  query(urlPath: string, status: string): Observable<any[]> {
    return this.afoDatabase.list(urlPath, {
      query: {
        orderByChild: 'categoryId',
        equalTo: status,
        limitToFirst: 15
      }
    }).first();
  }

}

