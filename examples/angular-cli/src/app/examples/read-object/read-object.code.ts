export const ReadObjectCode = {
  name: 'read-object',
  html: `<h2>{{ (info | async)?.title }}</h2>`,
  typescript:
`
import { Component } from '@angular/core';

import { AfoObjectObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-read-object',
  templateUrl: './read-object.component.html'
})
export class ReadObjectComponent {
  info: AfoObjectObservable<any>;
  constructor(afoDatabase: AngularFireOfflineDatabase) {
    this.info = afoDatabase.object('/info');
  }
}
`
};
