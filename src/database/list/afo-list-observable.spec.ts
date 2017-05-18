/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { AfoListObservable } from './afo-list-observable';
import { LocalUpdateService } from '../offline-storage/local-update-service';

describe('List Observable', () => {
  let listObservable: AfoListObservable<any>;
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
      resolve: undefined,
      toString: () => 'https://angularfire2-offline.firebaseio.com/key-1',
      database: {
        ref: () => {
          return {
            toString: () => 'https://angularfire2-offline.firebaseio.com/'
          };
        }
      }
    }};
    let pushPromise;
    ref.$ref.push = (value) => {
      let key = 'key-1';
      pushPromise = Promise.resolve(key);
      return pushPromise;
    };
    mockLocalForageService = new MockLocalForageService();
    localUpdateService = new LocalUpdateService(mockLocalForageService);
  });

  it('should push', done => {
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.push('new value').then((key) => {
      expect(key).toBe('key-1');
      done();
    });
  });

  it('should update', done => {
    ref.update = value => promise;
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.update('key', 'new value').then(value => {
      expect(value).toBe(2326347897);
      done();
    });
    resolve(2326347897);
  });

  it('should remove', done => {
    ref.remove = value => promise;
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.remove('key').then(value => {
      expect(value).toBe(234580008754);
      done();
    });
    resolve(234580008754);
  });

  it('should emulate push if existing value is null', done => {
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.value = null;
    listObservable.subscribe(x => {
      expect(x[0].$value).toBe('a special value');
      done();
    });
    listObservable.emulate('push', 'a special value', 'key-1');
  });

  it('should emulate push if existing value is an array', done => {
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.value = [
      {
        $key: 'key-1',
        $value: 'nothing important'
      },
      {
        $key: 'key-2',
        $value: 'another value'
      }
    ];
    listObservable.subscribe(x => {
      expect(x[0].$value).toBe('a special value');
    });
    setTimeout(() => {
      done();
    });
    listObservable.emulate('push', 'a special value', 'key-1');
  });

  it('should update an existing value', done => {
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.value = [
      {
        $key: 'key-1',
        $value: 'nothing important'
      },
      {
        $key: 'key-2',
        $value: 'another value'
      }
    ];
    listObservable.subscribe(x => {
      expect(x[1].$key).toBe('key-2');
      expect(x[1].$value).toBe('a special value');
    });
    setTimeout(() => {
      done();
    });
    listObservable.emulate('update', 'a special value', 'key-2');
  });

  it('should update by pushing to the array if the value does not exist', done => {
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.value = [
      {
        $key: 'key-1',
        $value: 'nothing important'
      },
      {
        $key: 'key-2',
        $value: 'another value'
      }
    ];
    listObservable.subscribe(x => {
      expect(x[2].$key).toBe('key-3');
      expect(x[2].$value).toBe('a special value');
    });
    setTimeout(() => {
      done();
    });
    listObservable.emulate('update', 'a special value', 'key-3');
  });

  it('should remove a list', done => {
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.value = [
      {
        $key: 'key-1',
        $value: 'nothing important'
      },
      {
        $key: 'key-2',
        $value: 'another value'
      }
    ];
    listObservable.subscribe(x => {
      expect(x.length).toBe(0);
    });
    setTimeout(() => {
      done();
    });
    listObservable.emulate('remove');
  });

  it('should remove a value', done => {
    listObservable = new AfoListObservable<any>(ref, localUpdateService);
    listObservable.value = [
      {
        $key: 'key-1',
        $value: 'nothing important'
      },
      {
        $key: 'key-2',
        $value: 'another value'
      },
      {
        $key: 'key-3',
        $value: 'another other value'
      }
    ];
    listObservable.subscribe(x => {
      expect(x.length).toBe(2);
      expect(x[1].$key).toBe('key-3');
    });
    setTimeout(() => {
      done();
    });
    listObservable.emulate('remove', null, 'key-2');
  });

  // it('should emulate a que for push', done => {
  //   listObservable = new AfoListObservable<any>(ref, localUpdateService);
  //   listObservable.que = [
  //     {
  //       method: 'push',
  //       value: {title: 'item-1'},
  //       key: 'key-1'
  //     }
  //   ];
  //   listObservable.subscribe(x => {
  //     expect(x[0].title).toBe('item-1');
  //     expect(x[0].$exists()).toBe(true);
  //     done();
  //   });
  //   listObservable.uniqueNext([]);
  // });
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
