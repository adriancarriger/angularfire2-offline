/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { ObjectObservable } from '../src/object-observable';
import { LocalUpdateService } from '../src/local-update-service';

describe('Object Observable', () => {
  let objectObservable: ObjectObservable<any>;
  let mockLocalForageService: MockLocalForageService;
  let localUpdateService: LocalUpdateService;
  let resolve;
  let promise;
  let ref;
  beforeEach(() => {
    promise = new Promise(r => resolve = r);
    ref = {$ref: {ref: {key: 'key-1'}}};
    mockLocalForageService = new MockLocalForageService();
    localUpdateService = new LocalUpdateService( mockLocalForageService );
  });

  it('should set a value', done => {
    ref.set = value => promise;
    objectObservable = new ObjectObservable<any>(ref, localUpdateService);
    objectObservable.set('new value').then(value => {
      expect(value).toBe(2326347897);
      done();
    });
    resolve(2326347897);
  });

  it('should update', done => {
    ref.update = value => promise;
    objectObservable = new ObjectObservable<any>(ref, localUpdateService);
    objectObservable.update('new value').then(value => {
      expect(value).toBe(2326347897);
      done();
    });
    resolve(2326347897);
  });

  it('should remove', done => {
    ref.remove = value => promise;
    objectObservable = new ObjectObservable<any>(ref, localUpdateService);
    objectObservable.remove().then(value => {
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
