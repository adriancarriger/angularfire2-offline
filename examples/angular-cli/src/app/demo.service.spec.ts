/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DemoService } from './demo.service';

describe('DemoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemoService]
    });
  });

  it('should ...', inject([DemoService], (service: DemoService) => {
    expect(service).toBeTruthy();
  }));
});
