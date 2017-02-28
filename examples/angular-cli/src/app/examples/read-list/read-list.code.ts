export const ReadListCode = {
  name: 'read-list',
  html:
`
<ul>
  <li *ngFor="let item of items | async">
    {{ item?.name }}
  </li>
</ul>
`,
  typescript:
`
import { Component, OnInit } from '@angular/core';

import { AngularFireOffline, AfoListObservable } from 'angularfire2-offline';

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html'
})
export class ReadListComponent {
  items: AfoListObservable<any[]>;
  constructor(afo: AngularFireOffline) {
    this.items = afo.database.list('/items');
  }
}
`
};
