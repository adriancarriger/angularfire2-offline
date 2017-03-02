import { Component } from '@angular/core';

import { ReadObjectCode } from './examples/read-object/read-object.code';
import { ReadListCode } from './examples/read-list/read-list.code';
import { WriteObjectCode } from './examples/write-object/write-object.code';
import { WriteListCode } from './examples/write-list/write-list.code';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Related to showing the demo
  readObjectCode = ReadObjectCode;
  readListCode = ReadListCode;
  writeObjectCode = WriteObjectCode;
  writeListCode = WriteListCode;
}
