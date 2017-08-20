import { Component } from '@angular/core';

import {
  AngularFireOfflineDatabase,
  AfoListObservable,
  AfoObjectObservable
} from 'angularfire2-offline/database';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  afoGroceries: AfoListObservable<any[]>;
  afGroceries: FirebaseListObservable<any[]>;
  constructor(
    private afoDatabase: AngularFireOfflineDatabase,
    private afDatabase: AngularFireDatabase) {
    this.afoGroceries = this.afoDatabase.list('groceries');
    this.afGroceries = this.afDatabase.list('groceries');
  }
  addItem(newName: string) {
    this.afoGroceries.push({ text: newName });
  }
  deleteEverything() {
    this.afoGroceries.remove();
  }
  deleteItem(key: string) {
    this.afoGroceries.remove(key);
  }
  afoPrioritize(item) {
    const result = this.afoGroceries.update(item.$key, { text: item.text + '‼️' })
    .then(result => console.log(result));
  }
  afPrioritize(item) {
    this.afGroceries.update(item.$key, { text: item.text + '‼️' })
      .then(result => console.log(result));
  }
  reset() {
    this.afoGroceries.remove();
    this.afoGroceries.push({text: 'Milk'});
    this.afoGroceries.push({text: 'Eggs'});
    this.afoGroceries.push({text: 'Bread'});
  }
}
