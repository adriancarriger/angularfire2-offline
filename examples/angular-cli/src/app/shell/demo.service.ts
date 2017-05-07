import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as Prism from 'prismjs';

@Injectable()
export class DemoService {

  constructor(private domSanitizer: DomSanitizer) { }
  highlight(input, language) {
    return this.safe( this.getHtml(input, language) );
  }
  private getHtml(input, language) {
    return Prism.highlight(input, Prism.languages[language]);
  }
  private safe(input) {
    return this.domSanitizer.bypassSecurityTrustHtml(input);
  }
}
