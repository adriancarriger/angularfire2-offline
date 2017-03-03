import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { DemoService } from '../demo.service';
import { ConflictMessagesCode } from '../../examples/conflict-messages/conflict-messages.code';

@Component({
  selector: 'app-demo-message-conflict',
  templateUrl: './message-conflict.component.html',
})
export class MessageConflictTabComponent implements OnInit {
  conflictMessagesCode = ConflictMessagesCode;
  structure: SafeHtml;
  rules: SafeHtml;
  constructor(private demoService: DemoService) { }
  ngOnInit() {
    this.structure =
      this.demoService.highlight(this.conflictMessagesCode.structure, 'javascript');
    this.rules =
      this.demoService.highlight(this.conflictMessagesCode.rules, 'javascript');
  }
}
