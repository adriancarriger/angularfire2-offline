import { Component, OnInit } from '@angular/core';

import { AngularFireOffline, ListObservable } from 'angularfire2-offline';

@Component({
  selector: 'app-write-list',
  templateUrl: './write-list.component.html'
})
export class WriteListComponent {
  groceries: ListObservable<any[]>;
  constructor(private afo: AngularFireOffline) {
    this.groceries = this.afo.database.list('/groceries');
  }
  addItem(newName: string) {
    this.groceries.push({ text: newName });
  }
  prioritize(item) {
    this.groceries.update(item.$key, { text: item.text + '‼️' });
  }
  deleteItem(key: string) {
    this.groceries.remove(key);
  }
  deleteEverything() {
    this.groceries.remove();
  }
  reset() {
    this.groceries.remove();
    this.groceries.push({text: 'milk'});
    this.groceries.push({text: 'eggs'});
    this.groceries.push({text: 'bread'});
  }
}
