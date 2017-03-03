import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-other-conflict',
  template: `
  <md-card class="readable">
    
    <h2>Other Issues</h2>

    <md-card-content>
      If you have a use case not covered here please <a href="https://github.com/adriancarriger/angularfire2-offline/issues">
        open an issue
      </a>.
    </md-card-content>

  </md-card>
  `,
  styles: [
    `
    md-card {
      min-height: 120px;
    }
    `
  ]
})
export class OtherConflictTabComponent { }