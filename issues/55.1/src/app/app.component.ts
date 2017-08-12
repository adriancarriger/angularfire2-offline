import { Component } from '@angular/core';

import jsonFile from './json-file-example.json';

import {
  AngularFireOfflineDatabase,
  AfoListObservable,
  AfoObjectObservable
} from 'angularfire2-offline/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  groceries: AfoListObservable<any[]>;
  car: AfoObjectObservable<any>;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.groceries = this.afoDatabase.list('groceries');
    this.car = this.afoDatabase.object('car');
    this.initializeData();
  }

  /**
   * Example of adding inital data from a Json file (will work offline)
   */
  initializeData() {
    // Add list data from Json file
    this.groceries.remove(); // Remove is optional
    jsonFile.listExample.forEach(listItem => {
      this.groceries.push(listItem);
    });
    // Add object data from Json file
    this.car.set(jsonFile.objectExample);
  }
}
