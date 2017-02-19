export const SetObjectCode = {
  html:
`
<h2>Count: {{ counter | async }}</h2>
<button (click)="increment()" md-raised-button color="accent">+1</button>
`,
  typescript:
`
import { Component, OnInit } from '@angular/core';

import { AngularFireOffline, ObjectObservable } from 'angularfire2-offline';

@Component({
  selector: 'app-set-object',
  templateUrl: './set-object.component.html'
})
export class SetObjectComponent {
  counter: ObjectObservable<number>;
  lastCount: number;
  constructor(afo: AngularFireOffline) {
    this.counter = afo.database.object('/counter');
    this.counter.subscribe(value => this.lastCount = value);
  }
  increment() {
    this.lastCount++;
    this.counter.set(this.lastCount);
  }
}
`
};
