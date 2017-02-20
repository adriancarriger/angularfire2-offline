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
  prioritize(key: string, newText: string) {
    this.groceries.update(key, { important: true });
  }
  deleteItem(key: string) {
    this.groceries.remove(key);
  }
  deleteEverything() {
    this.groceries.remove();
  }
  // Reset
  reset() {
    this.afo.database.object('/groceries').set({
      '0': {text: 'milk'},
      '1': {text: 'eggs'},
      '2': {text: 'bread'}
    });
  }
}
