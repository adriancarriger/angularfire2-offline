import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireOffline } from 'angularfire2-offline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cars: Observable<any[]>; // Mapping destroys Afo write methods such as push, set, and remove
  constructor(private afo: AngularFireOffline) {
    this.cars = this.afo.database.list('/issues/10/users/1/cars') // car user data
      .map(carsMeta => {
        return carsMeta.map(carMeta => {
          this.afo.database.object(`/issues/10/cars/${carMeta.id}`) // car data
            .subscribe(carData => carMeta.data = carData); // merge car data to meta object
          return carMeta; // return merged car data
        });
      });
  }
}
