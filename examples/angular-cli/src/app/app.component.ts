import { Component } from '@angular/core';

import { ReadObjectCode } from './examples/read-object/read-object.code';
import { ReadListCode } from './examples/read-list/read-list.code';
import { SetObjectCode } from './examples/set-object/set-object.code';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readObjectCode = ReadObjectCode;
  readListCode = ReadListCode;
  setObjectCode = SetObjectCode;
  // items: ListObservable<any[]>;
  // counter: ObjectObservable<number>;
  // lastCount;

  // constructor(afo: AngularFireOffline) {
  //   // this.items = afo.database.list('/items');
  //   // this.counter = afo.database.object('/counter');
  //   // this.counter.subscribe(value => this.lastCount = value);
  // }
  // increment() {
  //   this.lastCount++;
  //   this.counter.set(this.lastCount);
  // }
}
