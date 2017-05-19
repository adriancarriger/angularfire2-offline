import { Component } from '@angular/core';

import {
  AngularFireOfflineDatabase,
  AfoListObservable,
  AfoObjectObservable
} from 'angularfire2-offline/database';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  groceries: AfoListObservable<any[]>;
  filteredGroceries: AfoListObservable<any[]>;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.groceries = this.afoDatabase.list('/groceries');

    this.filteredGroceries = this.afoDatabase.list('/groceries', {
      query: {
        orderByChild: 'text',
        equalTo: 'Apples'
      }
    });
  }
  addItem(newName: string) {
    this.groceries.push({ text: newName });
  }
  deleteEverything() {
    this.groceries.remove();
  }
  deleteItem(key: string) {
    this.groceries.remove(key);
  }
  prioritize(item) {
    this.groceries.update(item.$key, { text: item.text + '‼️' });
  }
  reset() {
    this.groceries.remove();
    this.groceries.push({text: 'Milk'});
    this.groceries.push({text: 'Eggs'});
    this.groceries.push({text: 'Bread'});
  }
}
