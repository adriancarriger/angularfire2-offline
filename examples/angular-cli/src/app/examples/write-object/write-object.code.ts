export const WriteObjectCode = {
  name: 'write-object',
  html:
`
<button (click)="increaseSpeed()" md-raised-button color="accent">Speed +1</button>
<button (click)="remove('engine')" md-raised-button color="accent">Remove engine</button>
<button (click)="reset()" md-raised-button color="accent">Reset</button>

<h3>JSON Result:</h3>
{{ car | async | json }}
`,
  typescript:
`
import { Component } from '@angular/core';

import { AngularFireOffline, AfoObjectObservable } from 'angularfire2-offline';

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
  constructor(private afo: AngularFireOffline) {
    this.car = this.afo.database.object('/car');
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
    this.afo.database.object(\`/car/\${item}\`).remove();
  }
}
`
};
