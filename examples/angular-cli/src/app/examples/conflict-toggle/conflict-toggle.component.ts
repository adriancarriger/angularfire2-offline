import { Component } from '@angular/core';
import { AfoObjectObservable, AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Component({
  selector: 'app-conflict-toggle',
  templateUrl: './conflict-toggle.component.html'
})
export class ConflictToggleComponent {
  fries: AfoObjectObservable<any>;
  constructor(private afoDatabase: AngularFireOfflineDatabase) {
    this.fries = afoDatabase.object('conflict/toggle');
  }
  updateFries(checked: boolean) {
    this.fries.set({
      requested: checked,
      timestamp: Date.now()
    });
  }
}
