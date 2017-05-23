import { Component } from '@angular/core';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import {
  AngularFireOfflineDatabase,
  AfoObjectObservable
} from 'angularfire2-offline/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Af properties
  carAf: AfoObjectObservable<any>;
  carObjectAf: Object;

  // Afo properties
  carAfo: AfoObjectObservable<any>;
  carObjectAfo: Object;

  constructor(
    private afDatabase: AngularFireDatabase,
    private afoDatabase: AngularFireOfflineDatabase) {

    // Setup Af
    this.carAf = this.afoDatabase.object('/car');
    this.afDatabase.object('car').subscribe(car => {
      this.carObjectAf = car;
      console.log('af', car);
    });

    // Setup Afo
    this.carAfo = this.afoDatabase.object('/car');
    this.carAfo.subscribe(car => {
      this.carObjectAfo = car;
      console.log('afo', car);
    });
  }

  /**
   * increaseSpeed Af
   */
  increaseSpeedUsingAf() {
    this.carObjectAf['maxSpeed']++;
    console.log(this.carObjectAf);
    this.afDatabase.object('car').update(this.carObjectAf);
  }

  /**
   * increaseSpeed Afo
   */
  increaseSpeedUsingAfo() {
    this.carObjectAfo['maxSpeed']++;
    console.log(this.carObjectAfo);
    this.carAf.update(this.carObjectAfo);
  }

}
