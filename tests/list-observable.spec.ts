/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { ListObservable } from '../src/list-observable';

describe('List Observable', () => {
  let listObservable: ListObservable<any>;
  let mockLocalForageService: MockLocalForageService;
  let resolve;
  let promise;
  let ref;
  beforeEach(() => {
    promise = new Promise(r => resolve = r);
    ref = {$ref: {ref: {key: 'key-1'}}};
    mockLocalForageService = new MockLocalForageService();
  });

  it('should push', done => {
    ref.push = value => promise;
    listObservable = new ListObservable<any>(ref, mockLocalForageService);
    listObservable.push('new value').then(value => {
      expect(value).toBe(23425667532);
      done();
    });
    resolve(23425667532);
  });

  it('should update', done => {
    ref.update = value => promise;
    listObservable = new ListObservable<any>(ref, mockLocalForageService);
    listObservable.update('key', 'new value').then(value => {
      expect(value).toBe(2326347897);
      done();
    });
    resolve(2326347897);
  });

  it('should remove', done => {
    ref.remove = value => promise;
    listObservable = new ListObservable<any>(ref, mockLocalForageService);
    listObservable.remove('key').then(value => {
      expect(value).toBe(234580008754);
      done();
    });
    resolve(234580008754);
  });
});

@Injectable()
export class MockLocalForageService {
  resolves = {};
  setValue;
  getItem(key) {
    let resolve;
    const promise = new Promise(r => resolve = r);
    this.resolves[key] = resolve;
    return promise;
  }
  setItem(setValue) { this.setValue = setValue; }
  update(key, value, skipIfNotFound?) {
    if (skipIfNotFound && !(key in this.resolves)) { return; }
    this.resolves[key](value);
  }
}
