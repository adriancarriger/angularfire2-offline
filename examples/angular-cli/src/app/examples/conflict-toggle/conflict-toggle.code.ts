/* tslint:disable */
export const ConflictToggleCode = {
  name: 'conflict-toggle',
  html: `
<md-slide-toggle (change)="updateFries($event.checked)" [checked]="(fries | async)?.requested">
  Would you like fries with that?
</md-slide-toggle>

<div>
  🍔<span *ngIf="(fries | async)?.requested"> 🍟</span>
</div>
  `,
  typescript:
`
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
`,
structure: `
{
  "toggle": {
    "value": "true"
    "timestamp": 1405704370369
  }
}
`,
rules: `
{
  "rules": {
    "conflict": {
      "toggle": {
        ".write": "true",
        ".validate": "newData.child('timestamp').val() > data.child('timestamp').val() && newData.child('timestamp').val() < (now + 5000)",
        "requested": {
          ".validate": "newData.isBoolean()"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        },
        "$other": { ".validate": "false" }
      }
    }
  }
}
`
};
