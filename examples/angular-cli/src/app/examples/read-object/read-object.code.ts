export const ReadObjectCode = {
  name: 'read-object',
  html: `<h2>{{ (info | async)?.title }}</h2>`,
  typescript:
`
import { Component, OnInit } from '@angular/core';

import { AngularFireOffline, AfoObjectObservable } from 'angularfire2-offline';

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
`
};
