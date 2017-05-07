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
import { Component } from '@angular/core';

import { AfoListObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-read-list',
  templateUrl: './read-list.component.html'
})
export class ReadListComponent {
  items: AfoListObservable<any[]>;
  constructor(afoDatabase: AngularFireOfflineDatabase) {
    this.items = afoDatabase.list('/items');
  }
}
`
};
