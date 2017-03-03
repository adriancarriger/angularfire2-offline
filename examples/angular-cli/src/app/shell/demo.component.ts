import { Component, Input, OnInit } from '@angular/core';

import { DemoService } from './demo.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html'
})
export class DemoComponent implements OnInit {
  @Input() code;
  html;
  typescript;
  constructor(private demoService: DemoService) { }

  ngOnInit() {
    this.html = this.demoService.highlight(this.code.html, 'html');
    this.typescript = this.demoService.highlight(this.code.typescript, 'javascript');
  }
}
