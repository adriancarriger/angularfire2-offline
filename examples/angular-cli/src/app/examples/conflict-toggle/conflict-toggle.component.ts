import { Component } from '@angular/core';
import { AfoObjectObservable, AngularFireOffline } from 'angularfire2-offline';

@Component({
  selector: 'app-conflict-toggle',
  templateUrl: './conflict-toggle.component.html'
})
export class ConflictToggleComponent {
  fries: AfoObjectObservable<any>;
  constructor(private afo: AngularFireOffline) {
    this.fries = afo.database.object('conflict/toggle');
  }
  updateFries(checked: boolean) {
    this.fries.set({
      requested: checked,
      timestamp: Date.now()
    });
  }
}
