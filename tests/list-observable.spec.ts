/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { ListObservable } from '../src/list-observable';
import { LocalUpdateService } from '../src/local-update-service';

describe('List Observable', () => {
  let listObservable: ListObservable<any>;
  let mockLocalForageService: MockLocalForageService;
  let localUpdateService: LocalUpdateService;
  let resolve;
  let promise;
  let ref;
  beforeEach(() => {
    promise = new Promise(r => resolve = r);
    ref = {$ref: {
      ref: {key: 'key-1'},
      push: undefined,
      resolve: undefined
    }};
    let pushPromise;
    ref.$ref.push = (value, callback) => {
      callback();
      return 'key-1';
    };
    mockLocalForageService = new MockLocalForageService();
    localUpdateService = new LocalUpdateService(mockLocalForageService);
  });

  it('should push', done => {
    listObservable = new ListObservable<any>(ref, localUpdateService);
    listObservable.push('new value').then(() => {
      done();
    });
  });

  it('should update', done => {
    ref.update = value => promise;
    listObservable = new ListObservable<any>(ref, localUpdateService);
    listObservable.update('key', 'new value').then(value => {
      expect(value).toBe(2326347897);
      done();
    });
    resolve(2326347897);
  });

  it('should remove', done => {
    ref.remove = value => promise;
    listObservable = new ListObservable<any>(ref, localUpdateService);
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
