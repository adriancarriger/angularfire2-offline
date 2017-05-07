import { Component } from '@angular/core';

import { AfoObjectObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-write-object',
  templateUrl: './write-object.component.html'
})
export class WriteObjectComponent {
  car: AfoObjectObservable<any>;
  defaultCar = {
    'tires': 4,
    'engine': 'V8',
    'type': 'Sedan',
    'maxSpeed': 80
  };
  lastSpeed: number;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.car = this.afoDatabase.object('/car');
    this.car.subscribe(car => this.lastSpeed = car['maxSpeed']);
  }
  /**
   * Update
   */
  increaseSpeed() {
    this.lastSpeed++;
    this.car.update({maxSpeed: this.lastSpeed});
  }
  /**
   * Set
   */
  reset() {
    this.car.set(this.defaultCar);
  }
  /**
   * Remove
   */
  remove(item) {
    this.afoDatabase.object(`/car/${item}`).remove();
  }
}
