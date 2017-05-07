export const WriteListCode = {
  name: 'write-list',
  html:
`
<ul>
  <li *ngFor="let item of groceries | async">
    {{item.text}}
    <button (click)="deleteItem(item.$key)" *ngIf="item.text === 'Bread'" md-button color="primary">Make gluten free ❌ 🍞</button>
    <button (click)="prioritize(item)" *ngIf="item.text === 'Eggs'" md-button color="primary">Make {{item.text}} important ‼️</button>
  </li>
</ul>
<p *ngIf="(groceries | async)?.length === 0">List empty</p>

<button (click)="addItem('Milk')" md-raised-button>Add Milk 🥛</button>
<button (click)="addItem('Apples')" md-raised-button>Add Apples 🍎</button>
<button (click)="addItem('Cucumbers')" md-raised-button>Add Cucumbers 🥒</button>
<button (click)="deleteEverything()" md-raised-button>Remove Everything 🔥</button>
<button (click)="reset()" md-raised-button>Reset ♻️</button>
`,
  typescript:
`
import { Component } from '@angular/core';

import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-write-list',
  templateUrl: './write-list.component.html'
})
export class WriteListComponent {
  groceries: AfoListObservable<any[]>;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.groceries = this.afoDatabase.list('/groceries');
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
`
};
