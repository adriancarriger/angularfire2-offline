import { Injectable } from '@angular/core';

const Prism = require('prismjs');

@Injectable()
export class DemoService {

  constructor() { }
  highlite(input, language) {
    return Prism.highlight(input, Prism.languages[language]);
  }
}
