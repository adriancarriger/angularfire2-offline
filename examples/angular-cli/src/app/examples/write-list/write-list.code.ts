export const WriteListCode = {
  name: 'write-list',
  html:
`
<ul>
  <li *ngFor="let item of groceries | async">
    {{item.text}}
    <button (click)="deleteItem(item.$key)" *ngIf="item.text === 'bread'" md-button color="primary">Make gluten free ❌ 🍞</button>
    <button (click)="prioritize(item)" *ngIf="item.text === 'eggs'" md-button color="primary">Make {{item.text}} important ‼️</button>
  </li>
</ul>
<p *ngIf="(groceries | async)?.length === 0">List empty</p>

<button (click)="addItem('Milk')" md-raised-button>Add Milk 🥛</button>
<button (click)="addItem('Apples')" md-raised-button>Add Apples 🍎</button>
<button (click)="addItem('Cucumbers')" md-raised-button>Add Cucumbers 🥒</button>
<button (click)="deleteEverything()" md-raised-button>Remove Everything 🔥</button>
<button (click)="reset()" md-raised-button>Reset ♻️/button>
`,
  typescript:
`
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
`
};
