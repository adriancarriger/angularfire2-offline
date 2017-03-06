import { Component } from '@angular/core';

import {
  AngularFireOffline,
  AfoListObservable,
  AfoObjectObservable
} from 'angularfire2-offline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  listExample: AfoListObservable<any[]>;
  objectExample: AfoObjectObservable<any>;
  constructor(private afo: AngularFireOffline) {
    this.listExample = this.afo.database.list('groceries');
    this.objectExample = this.afo.database.object('car');
  }
}
