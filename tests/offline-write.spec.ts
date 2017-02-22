/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { OfflineWrite, WriteComplete } from '../src/offline-write';
import { WriteCache } from '../src/interfaces';

describe('Object Observable', () => {
  let mockLocalForageService: MockLocalForageService;
  let promise;
  const writeCache: WriteCache = {
    lastId: 1,
    cache: {
      '1': {
        type: 'object',
        ref: '/slug-2',
        method: 'set',
        args: ['test value']
      }
    }
  };
  beforeEach(() => {
    mockLocalForageService = new MockLocalForageService();
  });

  it('should get incomplete writes that were saved offline (1)', () => {
    let resolve;
    promise = new Promise(r => resolve = r);
    OfflineWrite(promise, 'list', 'ref', 'push', ['offline write value'], mockLocalForageService);
    mockLocalForageService.update('write', null);
    resolve();
  });

  it('should get incomplete writes that were saved offline (2)', () => {
    let resolve;
    promise = new Promise(r => resolve = r);
    OfflineWrite(promise, 'list', 'ref', 'push', ['offline write value'], mockLocalForageService);
    mockLocalForageService.update('write', writeCache);
    resolve();
  });

  it('should skip saving offline if write completes before localstorage value is returned', () => {
    let resolve;
    promise = new Promise(r => resolve = r);
    OfflineWrite(promise, 'list', 'ref', 'push', ['offline write value'], mockLocalForageService);
    resolve();
    mockLocalForageService.update('write', writeCache);
  });

  it('should remove an item after it completes', () => {
    WriteComplete(1, mockLocalForageService);
    mockLocalForageService.update('write', writeCache);
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
  setItem(key, setValue) {
    this.setValue = setValue;
    return new Promise(resolve => resolve());
  }
  update(key, value, skipIfNotFound?) {
    if (skipIfNotFound && !(key in this.resolves)) { return; }
    this.resolves[key](value);
  }
}
