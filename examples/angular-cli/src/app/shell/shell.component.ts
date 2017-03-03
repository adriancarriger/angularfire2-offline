import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ReadListCode } from '../examples/read-list/read-list.code';
import { ReadObjectCode } from '../examples/read-object/read-object.code';
import { WriteListCode } from '../examples/write-list/write-list.code';
import { WriteObjectCode } from '../examples/write-object/write-object.code';
/**
 * Primary shell
 */
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html'
})
export class ShellComponent implements OnInit {
  /**
   * Shell routing
   */
  activeLinkIndex = 0;
  tabLinks = [
    { label: 'Read Object', link: 'read-object' },
    { label: 'Read List', link: 'read-list' },
    { label: 'Write Object', link: 'write-object' },
    { label: 'Write List', link: 'write-list' },
    { label: 'Write Conflicts 😕', link: 'write-conflicts' }
  ];
  constructor(private router: Router) { }
  ngOnInit() {
    setTimeout(() => {
      this.activeLinkIndex =
        this.tabLinks.indexOf(this.tabLinks.find(tab => this.router.url.indexOf(tab.link) !== -1));
    });
  }
}
/**
 * Shell components
 */
@Component({
  selector: 'app-demo-read-object',
  template: `
  <app-demo [code]="readObjectCode">
    <app-read-object></app-read-object>
  </app-demo>
  `,
})
export class ReadObjectTabComponent {
  readObjectCode = ReadObjectCode;
}

@Component({
  selector: 'app-demo-read-list',
  template: `
  <app-demo [code]="readListCode">
    <app-read-list></app-read-list>
  </app-demo>
  `,
})
export class ReadListTabComponent {
  readListCode = ReadListCode;
}

@Component({
  selector: 'app-demo-write-object',
  template: `
  <app-demo [code]="writeObjectCode">
    <app-write-object></app-write-object>
  </app-demo>
  `,
})
export class WriteObjectTabComponent {
  writeObjectCode = WriteObjectCode;
}

@Component({
  selector: 'app-demo-write-list',
  template: `
  <app-demo [code]="writeListCode">
    <app-write-list></app-write-list>
  </app-demo>
  `,
})
export class WriteListTabComponent {
  writeListCode = WriteListCode;
}
