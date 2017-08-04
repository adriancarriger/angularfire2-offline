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
  lastSpeed = 100;
  objectExample: AfoObjectObservable<any>;
  defaultCar = {
    'tires': 4,
    'engine': 'V8',
    'type': 'Sedan',
    'maxSpeed': 80
  };
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.objectExample = this.afoDatabase.object('car');
  }

  write() {
    this.lastSpeed++;
    const promise = this.objectExample.update({maxSpeed: this.lastSpeed});
    promise.offline.then(() => console.log('Offline write complete'));
    promise.then(() => console.log('Online write complete'));
  }

}
