import { Component } from '@angular/core';

import { AfoObjectObservable, AngularFireOffline } from 'angularfire2-offline';

@Component({
  selector: 'app-read-object',
  templateUrl: './read-object.component.html'
})
export class ReadObjectComponent {
  info: AfoObjectObservable<any>;
  constructor(afo: AngularFireOffline) {
    this.info = afo.database.object('/info');
  }
}
