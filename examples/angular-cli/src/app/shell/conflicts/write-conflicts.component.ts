import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo-write-conflicts',
  templateUrl: './write-conflicts.component.html',
})
export class WriteConflictsComponent implements OnInit {
  activeLinkIndex = 0;
  tabLinks = [
    { label: 'Messages', link: 'messages' },
    { label: 'Toggle', link: 'toggle' },
    { label: 'Other', link: 'other' }
  ];
  constructor(private router: Router) { }
  ngOnInit() {
    setTimeout(() => {
      this.activeLinkIndex =
        this.tabLinks.indexOf(this.tabLinks.find(tab => this.router.url.indexOf(tab.link) !== -1));
    });
  }
}