/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { AfoListObservable } from './afo-list-observable';
import { InternalListObservable } from './internal-list-observable';

describe('List Observable', () => {
  let listObservable: AfoListObservable<any>;
  let mockInternalListObservable: MockInternalListObservable<any>;
  beforeEach(() => {
    mockInternalListObservable = new MockInternalListObservable();
    listObservable = new AfoListObservable(mockInternalListObservable);
  });

  // Promises
  ['push', 'remove', 'update'].forEach(method => {
    it(`should ${method}`, done => {
      listObservable[method]('new value').then(value => {
        expect(value).toBe(method);
        done();
      });
    });
  });

  // Other methods
  ['emulate', 'uniqueNext'].forEach(method => {
    it(`should ${method}`, () => {
      listObservable[method]('new value');
      expect(mockInternalListObservable.lastCalled).toBe(method);
    });
  });

  // Emulate variant
  it('should emulate', () => {
      listObservable.emulate('some-method', 'new value');
      expect(mockInternalListObservable.lastCalled).toBe('emulate');
      console.log(mockInternalListObservable.lastCalledValue);
    });
});

@Injectable()
export class MockInternalListObservable<T> extends InternalListObservable<T> {
  lastCalled;
  lastCalledValue;
  constructor() {
    super(null, null);
  }
  init() { }
  emulate(method, value) {
    this.lastCalled = 'emulate';
    this.lastCalledValue = value;
  }
  push(value) { return this.fakePromise('push'); }
  remove(value?) { return this.fakePromise('remove'); }
  update(key, value) { return this.fakePromise('update'); }
  uniqueNext(value) { this.lastCalled = 'uniqueNext'; }
  private fakePromise(returnValue) {
    return new Promise(r => r(returnValue));
  }
}
