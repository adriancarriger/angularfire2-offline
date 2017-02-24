/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { AngularFireOfflineDatabase } from '../src/database';
import { LocalForageToken } from '../src/localforage';
import { LocalUpdateService } from '../src/local-update-service';
import { WriteCache } from '../src/interfaces';

describe('Service: AngularFireOfflineDatabase', () => {
  let mockAngularFire: MockAngularFire;
  let mockLocalForageService: MockLocalForageService;
  beforeEach(() => {
    mockAngularFire = new MockAngularFire();
    mockLocalForageService = new MockLocalForageService();
    TestBed.configureTestingModule({
      providers: [
        AngularFireOfflineDatabase,
        LocalUpdateService,
        { provide: AngularFire, useValue: mockAngularFire },
        { provide: LocalForageToken, useValue: mockLocalForageService }
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents();
  }));

  it('should create the service', inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    expect(service).toBeTruthy();
  }));

  it('should return a list', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    let newValue = [
      { val: () => { return 'xyz'; } }
    ];
    service.list(key).subscribe(list => {
      expect(list[0].$value).toBe('xyz');
    });
    expect(service.cache[key].loaded).toBe(false);
    mockAngularFire.update(newValue);
  })));

  it('should not setup a list', inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    // Setup test - Set up list
    service.list(key, {});
    // If `setupObject` is called, then this will be false:
    expect(service.cache[key].loaded).toBe(false);
    // Setting to true
    service.cache[key].loaded = true;
    // Test
    service.list(key);
    // Will still be true if `setupObject` was not called
    expect(service.cache[key].loaded).toBe(true);
  }));

  it('should return an object', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let newValue = { val: () => { return 'abc23-7'; } };
    service.object('/slug-2').subscribe(object => {
      expect(object.$value).toBe('abc23-7');
    });
    mockAngularFire.update(newValue);
  })));

  it('should return an object', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let newValue = { val: () => { return 'abc23-7'; } };
    service.processing.current = false;
    service.object('/slug-2').subscribe(object => {
      expect(object.$value).toBe('abc23-7');
    });
    mockAngularFire.update(newValue);
  })));

  it('should not setup an object', inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    // Setup test - Set up list
    service.object(key, {});
    // If `setupObject` is called, then this will be false:
    expect(service.cache[key].loaded).toBe(false);
    // Setting to true
    service.cache[key].loaded = true;
    // Test
    service.object(key);
    // Will still be true if `setupObject` was not called
    expect(service.cache[key].loaded).toBe(true);
  }));

  it('should return a locally stored object value', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    service.object(key).subscribe(object => {
      expect(object.$value).toBe('293846488sxjfhslsl20201-4ghcjs');
      expect(object.$exists()).toEqual(true);
    });
    mockLocalForageService.update(`read${key}`, '293846488sxjfhslsl20201-4ghcjs');
  })));

  it('should not return a locally stored value if loaded', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      const key = '/slug-2';
      let returnedValue = false;
      service.object(key).subscribe(object => {
        returnedValue = true;
      });
      service.cache[key].loaded = true;
      mockLocalForageService.update(`read${key}`, '293846488sxjfhslsl20201-4ghcjs');
      // Wait for 500 ms to see if a value is returned
      setTimeout(() => {
        expect(returnedValue).toBe(false);
        done();
      }, 500);
    })();
  });

  it('should return a locally stored list', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      service.processing.current = false;
      const key = '/list-2';
      const listKeys = ['key-1', 'key-2', 'key-3'];
      service.list(key).subscribe(object => {
        expect(object[0].$value).toEqual('1');
        expect(object[1].$value).toEqual('1');
        expect(object[2].$value).toEqual('1');
        expect(object[2].$exists()).toEqual(true);
        expect(object[3]).toEqual(undefined);
      });
      mockLocalForageService.update(`read${key}`, ['key-1', 'key-2', 'key-3']);
      setTimeout(() => {
        listKeys.forEach(listKey => {
          mockLocalForageService.update(`read${key}/${listKey}`, '1');
        });
        setTimeout(() => {
          mockAngularFire.writeSetup({set: () => {}}, mockLocalForageService);
          mockLocalForageService.update(`read${key}`, ['key-1', 'key-2', 'key-3']);
          setTimeout(() => {
            listKeys.forEach(listKey2 => {
              mockLocalForageService.update(`read${key}/${listKey2}`, '1');
            });
            done();
          });
        });
      });
    })();
  });

  it('should not set if loaded', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      service.processing.current = false;
      const key = '/list-2';
      const listKeys = ['key-1', 'key-2', 'key-3'];
      service.list(key).subscribe(object => {
        expect(object[0].$value).toEqual('1');
        expect(object[1].$value).toEqual('1');
        expect(object[2].$value).toEqual('1');
        expect(object[2].$exists()).toEqual(true);
        expect(object[3]).toEqual(undefined);
      });
      mockLocalForageService.update(`read${key}`, ['key-1', 'key-2', 'key-3']);
      setTimeout(() => {
        listKeys.forEach(listKey => {
          mockLocalForageService.update(`read${key}/${listKey}`, '1');
        });
        setTimeout(() => {
          mockAngularFire.writeSetup({set: () => {}}, mockLocalForageService);
          mockLocalForageService.update(`read${key}`, ['key-1', 'key-2', 'key-3']);
          setTimeout(() => {
            service.cache[key].loaded = true;
            listKeys.forEach(listKey2 => {
              mockLocalForageService.update(`read${key}/${listKey2}`, '1');
            });
            done();
          });
        });
      });
    })();
  });

  it('should wait during processing', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      service.processing.current = true;
      const key = '/list-2';
      const listKeys = ['key-1', 'key-2', 'key-3'];
      service.list(key);
      service.cache[key].listInit = true;
      mockLocalForageService.update(`read${key}`, ['key-1', 'key-2', 'key-3']);
      setTimeout(() => {
        listKeys.forEach(listKey => {
          mockLocalForageService.update(`read${key}/${listKey}`, '1');
        });
        setTimeout(() => {
          mockAngularFire.writeSetup({set: () => {}}, mockLocalForageService);
          mockLocalForageService.update(`read${key}`, ['key-1', 'key-2', 'key-3']);
          setTimeout(() => {
            listKeys.forEach(listKey2 => {
              mockLocalForageService.update(`read${key}/${listKey2}`, '1');
            });
            expect(service.processing.cache[key].length).toBe(3);
            done();
          });
        });
      });
    })();
  });

  it('should not return a locally stored list if loaded', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      const key = '/list-2';
      const listKeys = ['key-1', 'key-2', 'key-3'];
      let returnedValue = false;
      service.list(key).subscribe(object => {
        returnedValue = true;
      });
      service.cache[key].loaded = true;
      mockLocalForageService.update(`read${key}`, ['key-1', 'key-2', 'key-3']);
      setTimeout(() => {
        listKeys.forEach(listKey => {
          mockLocalForageService.update(`read${key}/${listKey}`, '1', true);
        });
      });
      // Wait for 500 ms to see if a value is returned
      setTimeout(() => {
        expect(returnedValue).toBe(false);
        done();
      }, 500);
    })();
  });

  it('should do nothing if write cache is empty', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    mockLocalForageService.update('write', null);
  })));

  it('should do nothing if write cache is undefined', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let resolve;
    const promise = new Promise(r => resolve = r);
    const ref = {set: value => promise};
    mockAngularFire.writeSetup(ref, mockLocalForageService);
    const writeCache: WriteCache = {
      lastId: 1,
      cache: {}
    };
    mockLocalForageService.update('write', writeCache);
    resolve();
  })));

  it('should trigger offline writes', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let resolve;
    const promise = new Promise(r => resolve = r);
    const ref = {set: value => promise};
    mockAngularFire.writeSetup(ref, mockLocalForageService);
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
    mockLocalForageService.update('write', writeCache);
    resolve();
    setTimeout(() => mockLocalForageService.update('write', writeCache));
  })));

  it('should return a null value', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let newValue = { val: () => { return null; } };
    service.object('/slug-2').subscribe(object => {
      expect(object.$value).toBe(null);
    });
    mockAngularFire.update(newValue);
  })));
});

export const MockApiData = [
  {
    dataUrl: 'https://example.com/slug-1',
    date: '',
    id: 1,
    stamp: 1437120051000,
    slug: 'slug-1',
    text: 'this is string of searchable text'
  }
];

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
  setItem(setValue) {
    this.setValue = setValue;
    return new Promise(resolve => resolve());
  }
  update(key, value, skipIfNotFound?) {
    if (skipIfNotFound && !(key in this.resolves)) { return; }
    this.resolves[key](value);
  }
}

export class ObjectObservable<T> extends Observable<T> {
  constructor(private ref: FirebaseObjectObservable<any>, private localForage) {
    super();
  }
  set(value: any): firebase.Promise<void> {
    const promise: firebase.Promise<void> = this.ref.set(value);
    this.offlineWrite(promise, 'set', [value]);
    return promise;
  }
  update(value: Object): firebase.Promise<void> {
    const promise = this.ref.update(value);
    this.offlineWrite(promise, 'update', [value]);
    return promise;
  }
  remove(): firebase.Promise<void> {
    const promise = this.ref.remove();
    this.offlineWrite(promise, 'remove', []);
    return promise;
  }
  private offlineWrite(promise: firebase.Promise<void>, type: string, args: any[]) {

  }
}

export class ReplayItem<T> extends Subject<T> {
  constructor(private ref, private localForage) { super(); }
  asListObservable() { }
  asObjectObservable(): ObjectObservable<T> {
    const observable = new ObjectObservable<T>(this.ref, this.localForage);
    (<any>observable).source = this;
    return observable;
  }
}

@Injectable()
export class MockAngularFire {
  dataList$;
  database = {
    list: (input: string, query?) => {
      return this.dataList$.asObservable();
    },
    object: (input: string, query?) => {
      return this.dataList$.asObservable();
    }
  };
  private mockArray: Array<Object>;
  constructor() {
    this.init();
  }
  init() {
    this.mockArray = MockApiData;
    this.dataList$ = new Subject();
    this.update(this.mockArray);
  }
  writeSetup(ref, localforage) {
    this.dataList$ = new ReplayItem(ref, localforage);
    this.database = {
      list: (input: string, query?) => {
        return this.dataList$.asListObservable();
      },
      object: (input: string, query?) => {
        return this.dataList$.asObjectObservable();
      }
    };
  }
  update(newValue) {
    this.dataList$.next(newValue);
  }
}
