import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { DemoService } from '../demo.service';
import { ConflictToggleCode } from '../../examples/conflict-toggle/conflict-toggle.code';

@Component({
  selector: 'app-demo-toggle-conflict',
  templateUrl: './toggle-conflict.component.html',
})
export class ToggleConflictTabComponent implements OnInit {
  conflictToggleCode = ConflictToggleCode;
  structure: SafeHtml;
  rules: SafeHtml;
  constructor(private demoService: DemoService) { }
  ngOnInit() {
    this.structure =
      this.demoService.highlight(this.conflictToggleCode.structure, 'javascript');
    this.rules =
      this.demoService.highlight(this.conflictToggleCode.rules, 'javascript');
  }
}
