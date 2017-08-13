import { Component } from '@angular/core';

import { AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  groceriesList: FirebaseListObservable<any[]>;
  groceriesObject: FirebaseObjectObservable<any>;

  processing = false;
  max = 49;
  currentId = 1;
  totalTime: number;
  totalToAdd = 50;

  constructor(private afDatabase: AngularFireDatabase) {
    this.groceriesList = this.afDatabase.list('groceries');
    this.groceriesObject = this.afDatabase.object('groceries');
  }

  removeAll() {
    const startTime = performance.now();
    this.processing = true;
    this.groceriesList.remove()
      .then(() => {
        this.processing = false;
        this.updateTime(startTime);
      });
  }

  usingPush() {
    const startTime = performance.now();
    this.processing = true;
    const updates = [];
    const max = this.max + this.currentId;
    for (this.currentId; this.currentId <= max; ++this.currentId) {
      updates.push(this.groceriesList.push({text: 'Milk'}));
    }
    Promise.all(updates)
      .then(() => {
        this.processing = false;
        this.updateTime(startTime);
      });
  }

  usingUpdate() {
    const startTime = performance.now();
    this.processing = true;
    const updates = [];
    const max = this.max + this.currentId;
    for (this.currentId; this.currentId <= max; ++this.currentId) {
      updates.push(this.groceriesList.update(`${this.currentId}`, {text: 'Milk'}));
    }
    Promise.all(updates)
      .then(() => {
        this.processing = false;
        this.updateTime(startTime);
      });
  }

  usingSet() {
    const startTime = performance.now();
    this.processing = true;
    const max = this.max + this.currentId;
    const updateData = {};
    for (this.currentId; this.currentId <= max; ++this.currentId) {
      updateData[this.currentId] = {text: 'Milk'};
    }
    this.groceriesObject.set(updateData)
      .then(() => {
        this.processing = false;
        this.updateTime(startTime);
      });
  }

  private updateTime(startTime) {
    const total = performance.now() - startTime;
    this.totalTime = Math.round(total * 100) / 100;
  }
}
