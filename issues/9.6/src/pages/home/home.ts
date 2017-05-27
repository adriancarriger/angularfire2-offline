import { Component } from '@angular/core';
import {
  AngularFireOfflineDatabase,
  AfoListObservable } from 'angularfire2-offline/database';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // Properties
  items: AfoListObservable<any[]>;
  limit = 20;
  limitObservable = new ReplaySubject(20);

  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    // Set initial limit
    this.limitObservable.next(this.limit);

    // Subscribe to list
    this.items = afoDatabase.list('/issues/9/9-6', {
      query: {
        orderByChild: 'categoryId',
        limitToFirst: this.limitObservable
      }
    });
  }

  doInfinite(infiniteScroll) {
    // Add 5 Per page load
    this.limit += 10;

    // Update subject
    this.limitObservable.next(this.limit);

    // Call complete
    setTimeout(() => infiniteScroll.complete(), 1500);
  }
}
