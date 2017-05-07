/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { AfoObjectObservable } from './afo-object-observable';
import { LocalUpdateService } from './local-update-service';

describe('Object Observable', () => {
  let objectObservable: AfoObjectObservable<any>;
  let mockLocalForageService: MockLocalForageService;
  let localUpdateService: LocalUpdateService;
  let resolve;
  let promise;
  let ref;
  beforeEach(() => {
    promise = new Promise(r => resolve = r);
    ref = {$ref: {
      ref: {key: 'key-1'},
      toString: () => 'https://angularfire2-offline.firebaseio.com/key-1',
      database: {
        ref: () => {
          return {
            toString: () => 'https://angularfire2-offline.firebaseio.com/'
          };
        }
      }
    }};
    mockLocalForageService = new MockLocalForageService();
    localUpdateService = new LocalUpdateService( mockLocalForageService );
  });

  it('should set a value', done => {
    ref.set = value => promise;
    objectObservable = new AfoObjectObservable<any>(ref, localUpdateService);
    objectObservable.set('new value').then(value => {
      expect(value).toBe(2326347897);
      done();
    });
    resolve(2326347897);
  });

  it('should update', done => {
    ref.update = value => promise;
    objectObservable = new AfoObjectObservable<any>(ref, localUpdateService);
    objectObservable.update('new value').then(value => {
      expect(value).toBe(2326347897);
      done();
    });
    resolve(2326347897);
  });

  it('should remove', done => {
    ref.remove = value => promise;
    objectObservable = new AfoObjectObservable<any>(ref, localUpdateService);
    objectObservable.remove().then(value => {
      expect(value).toBe(234580008754);
      done();
    });
    resolve(234580008754);
  });

  it('should emulate', done => {
    objectObservable = new AfoObjectObservable<any>(ref, localUpdateService);
    objectObservable.value = {};
    objectObservable.subscribe(x => {
      expect(x.$value).toBe(null);
      done();
    });
    objectObservable.emulate('set', null);
  });

  it('should emulate a que for set', done => {
    objectObservable = new AfoObjectObservable<any>(ref, localUpdateService);
    objectObservable.que = [
      {
        method: 'set',
        value: {title: 'item-1'}
      }
    ];
    let item = 0;
    objectObservable.subscribe(x => {
      item++;
      if (item === 1) {
        expect(x.title).toBe('item-1');
        done();
      }
    });
    objectObservable.uniqueNext('a value');
  });

  it('should emulate a que for update', done => {
    objectObservable = new AfoObjectObservable<any>(ref, localUpdateService);
    objectObservable.que = [
      {
        method: 'update',
        value: {title: 'item-1'}
      }
    ];
    let item = 0;
    objectObservable.subscribe(x => {
      item++;
      if (item === 1) {
        expect(x.title).toBe('item-1');
        expect(x.key2).toBe('other value');
        expect(x.$exists()).toBe(true);
        done();
      }
    });
    objectObservable.uniqueNext({
      title: 'old title',
      key2: 'other value'
    });
  });
});

@Injectable()
export class MockLocalForageService {
  values = {};
  resolves = {};
  getItem(key) {
    return new Promise(resolve => {
      const value = this.values[key];
      if (value === undefined) { // resolve later
        this.resolves[key] = resolve;
      } else { // resolve immediately
        resolve(value);
      }
    });
  }
  setItem(key, value) {
    return new Promise(resolve => resolve(this.values[key] = value));
  }
}
