import { Component } from '@angular/core';

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
  objectExample: AfoObjectObservable<any>;
  defaultCar = {
    'tires': 4,
    'engine': 'V8',
    'type': 'Sedan',
    'maxSpeed': 80
  };
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.objectExample = this.afoDatabase.object('car');
    this.resetExample();
  }

  simulateTwoWrites() {

    setTimeout(() => {
      console.log('starting write #1');
      this.objectExample.update({maxSpeed: 100});
      setTimeout(() => {
        console.log('starting write #2');
        this.objectExample.update({engine: null});
      }, 3);
    }, 2000);
  }

  resetExample() {
    console.log('resetting example...');
    this.objectExample.set(this.defaultCar)
      .then(() => console.log('example has been reset'));
  }

}
