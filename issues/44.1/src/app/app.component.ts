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
  listExample: AfoListObservable<any[]>;
  objectExample: AfoObjectObservable<any>;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.listExample = this.afoDatabase.list('groceries');
    this.objectExample = this.afoDatabase.object('car');
  }

  // updatePerson(key: string, data) {
  //   this.afoDatabase.object(`/projectPersons/${this.personsKey}/${personKey}`)
  //     .update(data )
  //     .then(console.log('ProjectDbService:: receveived person update'));
  // }
}
