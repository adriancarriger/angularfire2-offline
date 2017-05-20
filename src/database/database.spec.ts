/*tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs/Rx';

import { AfoListObservable } from './list/afo-list-observable';
import { InternalListObservable } from './list/internal-list-observable';
import { AfoObjectObservable } from './object/afo-object-observable';
import { AngularFireOfflineDatabase } from './database';
import { LocalForageToken } from './offline-storage/localforage';
import { LocalUpdateService } from './offline-storage/local-update-service';
import { CacheItem, WriteCache } from './interfaces';

describe('Service: AngularFireOfflineDatabase', () => {
  let mockAngularFireDatabase: MockAngularFireDatabase;
  let mockLocalForageService: MockLocalForageService;
  beforeEach(() => {
    mockLocalForageService = new MockLocalForageService();
    mockAngularFireDatabase = new MockAngularFireDatabase();
    TestBed.configureTestingModule({
      providers: [
        AngularFireOfflineDatabase,
        LocalUpdateService,
        { provide: AngularFireDatabase, useValue: mockAngularFireDatabase },
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

  it('should return a list (1 - processing complete)', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      const key = '/slug-2';
      let newValue = [
        { val: () => { return 'xyz'; }, getPriority: () => {} }
      ];
      service.processing.current = false;
      service.list(key).subscribe(list => {
        expect(list[0].$value).toBe('xyz');
        done();
      });
      expect(service.listCache[key].loaded).toBe(false);
      mockAngularFireDatabase.update('list', newValue);
    })();
  });

  it('should return a list (2 - while processing)', () => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      const key = '/slug-2';
      let newValue = [
        { val: () => { return 'xyz'; }, getPriority: () => {} }
      ];
      service.list(key);
      mockAngularFireDatabase.update('list', newValue);
      expect(service.processing.listCache[key][0].$value).toBe('xyz');
    })();
  });

  it('should not setup a list', inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    // Setup test - Set up list
    service.list(key, {});
    // If `setupObject` is called, then this will be false:
    expect(service.listCache[key].loaded).toBe(false);
    // Setting to true
    service.listCache[key].loaded = true;
    // Test
    service.list(key);
    // Will still be true if `setupObject` was not called
    expect(service.listCache[key].loaded).toBe(true);
  }));

  it('should return an object', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let newValue = { val: () => { return 'abc23-7'; } };
    service.object('/slug-2').subscribe(object => {
      expect(object.$value).toBe('abc23-7');
    });
    mockAngularFireDatabase.update('object', newValue);
  })));

  it('should return an object', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let newValue = { val: () => { return 'abc23-7'; } };
    service.processing.current = false;
    service.object('/slug-2').subscribe(object => {
      expect(object.$value).toBe('abc23-7');
    });
    mockAngularFireDatabase.update('object', newValue);
  })));

  it('should not setup an object', inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    // Setup test - Set up list
    service.object(key, {});
    // If `setupObject` is called, then this will be false:
    expect(service.objectCache[key].loaded).toBe(false);
    // Setting to true
    service.objectCache[key].loaded = true;
    // Test
    service.object(key);
    // Will still be true if `setupObject` was not called
    expect(service.objectCache[key].loaded).toBe(true);
  }));

  it('should return a locally stored object value (1 - with processing)',
    async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    mockLocalForageService.values[`read/object${key}`] = '293846488sxjfhslsl20201-4ghcjs';
    service.processing.current = true;
    service.object(key).subscribe(object => {
      expect(object.$value).toBe('293846488sxjfhslsl20201-4ghcjs');
      expect(object.$exists()).toEqual(true);
    });
  })));

  it('should return a locally stored object value (2 - not processing)',
    async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    service.processing.current = false;
    mockLocalForageService.values[`read/object${key}`] = '293846488sxjfhslsl20201-4ghcjs';
    service.object(key).subscribe(object => {
      expect(object.$value).toBe('293846488sxjfhslsl20201-4ghcjs');
      expect(object.$exists()).toEqual(true);
    });
  })));

  it('should not return a locally stored value if loaded', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      const key = '/slug-2';
      let returnedValue = false;
      service.processing.current = false;
      mockLocalForageService.values[`read/object${key}`] = '293846488sxjfhslsl20201-4ghcjs';
      service.object(key).subscribe(object => {
        // Expect this to not happen
        returnedValue = true;
      });
      // Fake loading
      service.objectCache[key].loaded = true;
      // Wait for result
      setTimeout(() => {
        expect(returnedValue).toBe(false);
        done();
      });
    })();
  });

  it('get local list (1) - should update value',
    async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    service.processing.current = false;
    const key = '/list-2';
    const listKeys = ['key-1', 'key-2', 'key-3'];
    // Prepare return values for localForage
    mockLocalForageService.values[`read/list${key}`] = listKeys;
    listKeys.forEach(listKey => {
      mockLocalForageService.values[`read/object${key}/${listKey}`] = '1';
    });
    // Run test
    service.list(key).subscribe(object => {
      expect(object[0].$value).toEqual('1');
      expect(object[1].$value).toEqual('1');
      expect(object[2].$value).toEqual('1');
      expect(object[2].$exists()).toEqual(true);
      expect(object[3]).toEqual(undefined);
    });
  })));

  it('get local list (2) - should not update value if loaded', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      service.processing.current = false;
      let returnedValue = false;
      const key = '/list-2';
      const listKeys = ['key-1', 'key-2', 'key-3'];
      // Prepare return values for localForage
      mockLocalForageService.values[`read/list${key}`] = listKeys;
      listKeys.forEach(listKey => {
        mockLocalForageService.values[`read/object${key}/${listKey}`] = '1';
      });
      // Run test
      service.list(key).subscribe(object => {
        // Expect this to not happen
        returnedValue = true;
      });
      // Fake loading
      service.listCache[key].loaded = true;
      // Wait for result
      setTimeout(() => {
        expect(returnedValue).toBe(false);
        done();
      });
    })();
  });

  it('should unsubscribe from a list',
    async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    const key = '/slug-2';
    let newValue = [
      { val: () => { return 'xyz'; }, getPriority: () => {} }
    ];
    const list = service.list(key);
    expect(list.isStopped).toBeFalsy();
    list.unsubscribe();
    expect(list.isStopped).toBeTruthy();
  })));

  describe('Wait while processing', () => {
    it('1 - wait for a list', done => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        service.processing.current = true;
        const key = '/list-2';
        const listKeys = ['key-1', 'key-2', 'key-3'];
        // Prepare return values for localForage
        mockLocalForageService.values[`read/list${key}`] = listKeys;
        listKeys.forEach(listKey => {
          mockLocalForageService.values[`read/object${key}/${listKey}`] = '1';
        });
        // Run test
        service.list(key);
        // Wait for results
        setTimeout(() => {
          const isDefined = service.processing.listCache[key] !== undefined;
          expect(isDefined).toBe(true);
          if (isDefined) { expect(service.processing.listCache[key].length).toBe(3); }
          done();
        });
      })();
    });

    it('2 - wait for an object', done => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        service.processing.current = true;
        const key = '/object-2';
        // Prepare return values for localForage
        mockLocalForageService.values[`read/object${key}`] = 'object value';
        // Run test
        service.object(key);
        // Wait for results
        setTimeout(() => {
          const isDefined = service.processing.objectCache[key] !== undefined;
          expect(isDefined).toBe(true);
          if (isDefined) { expect(service.processing.objectCache[key].$value).toBe('object value'); }
          done();
        });
      })();
    });
  });

  describe('Process writes', () => {
    it('1 - should remove a list', done => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        const key = 'item-1';
        const cacheItem: CacheItem = {
          type: 'list',
          ref: key,
          method: 'remove',
          args: []
        };
        const writeCache: WriteCache = {
          lastId: 3,
          cache: {
            '3': cacheItem
          }
        };
        mockLocalForageService.resolves['write'](writeCache);
        service.listCache[key] = {
          loaded: false,
          offlineInit: false,
          sub: new MockInternalListObservable()
        };
        service.processing.current = true;
        setTimeout(() => {
          expect(mockAngularFireDatabase.listData$.history[0]).toBe('remove');
          done();
        });
      })();
    });

    it('2 - should do nothing if write cache is empty',
      async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      mockLocalForageService.resolves['write'](null);
      setTimeout(() => {
        expect(service.cacheIndex).toBe(0);
      });
    })));

    it('3 - should do nothing if returned write cached is empty',
      async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      const writeCache: WriteCache = {
        lastId: 1,
        cache: {}
      };
      expect(service.processing.current).toBe(true);
      // Run test
      mockLocalForageService.resolves['write'](writeCache);
      // Wait for result
      setTimeout(() => {
        expect(service.cacheIndex).toBe(1);
        expect(service.processing.current).toBe(false);
      });
    })));

    it('4 - should check if it should emulate a list', done => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        const key = 'item-1';
        const cacheItem: CacheItem = {
          type: 'object',
          ref: key,
          method: 'set',
          args: []
        };
        const writeCache: WriteCache = {
          lastId: 3,
          cache: {
            '3': cacheItem
          }
        };
        mockLocalForageService.resolves['write'](writeCache);
        service.objectCache[key] = {
          loaded: false,
          offlineInit: false,
          sub: new MockAfoObjectObservable()
        };
        service.processing.current = true;
        setTimeout(() => {
          done();
        });
      })();
    });

    it('5 - should add valid items to emulateQue', done => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        service.emulateQue['/items'] = [];
        const cacheItem1: CacheItem = {
          type: 'object',
          ref: 'items/item-1',
          method: 'set',
          args: ['value1']
        };
        const writeCache: WriteCache = {
          lastId: 2,
          cache: {
            '3': cacheItem1
          }
        };
        mockLocalForageService.resolves['write'](writeCache);
        service.processing.current = true;
        setTimeout(() => {
          done();
        });
      })();
    });

    it('6 - should add valid items to emulateQue and create a new que item when empty', done => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        const cacheItem1: CacheItem = {
          type: 'object',
          ref: 'items/item-1',
          method: 'set',
          args: ['value1']
        };
        const writeCache: WriteCache = {
          lastId: 2,
          cache: {
            '3': cacheItem1
          }
        };
        mockLocalForageService.resolves['write'](writeCache);
        service.processing.current = true;
        setTimeout(() => {
          done();
        });
      })();
    });

    it('7 - should update the emulate List',
      async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      const writeCache: WriteCache = {
        lastId: 1,
        cache: {}
      };
      const cacheItem: CacheItem = {
        type: 'object',
        ref: 'items/item-1',
        method: 'set',
        args: ['value1']
      };
      service.listCache['items'] = {
        loaded: false,
        offlineInit: false,
        sub: new MockAfoObjectObservable()
      };
      service.emulateQue = {
        'random-key': [],
        'items': [
          cacheItem
        ]
      };
      mockLocalForageService.resolves['write'](writeCache);
      setTimeout(() => {
        expect(service.listCache['items'].sub.history[0].value).toBe('value1');
      });
    })));

    it('8 - should publish processed values',
      async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      const testResults = {items: undefined, thing: undefined};
      // Setup list
      service.listCache['items'] = {
        loaded: false,
        offlineInit: false,
        sub: new MockInternalListObservable()
      };
      service.processing.listCache['items'] = ['item-1', 'item-2'];
      service.listCache['items'].sub.subscribe(x => testResults.items = x);
      // Setup object
      service.objectCache['thing'] = {
        loaded: false,
        offlineInit: false,
        sub: new MockAfoObjectObservable()
      };
      service.processing.objectCache['thing'] = {title: 'thing-1'};
      service.objectCache['thing'].sub.subscribe(x => testResults.thing = x);
      // Run test
      mockLocalForageService.resolves['write'](null);
      // Wait for results
      setTimeout(() => {
        expect(testResults.thing.title).toBe('thing-1');
        expect(testResults.items[0]).toBe('item-1');
      });
    })));
  });

  describe('Unsubscribe', () => {
    it('should unsubscribe from an object', done => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        let newValue = { val: () => { return 'abc23-7'; } };
        let afoObject = service.object('/slug-2');

        afoObject.subscribe(object => {
          expect(object.$value).toBe('abc23-7');
        });
        mockAngularFireDatabase.update('object', newValue);

        afoObject.complete();

        expect((<any>afoObject).ref.observers.length).toBe(0);
        setTimeout(done);
      })();
    });

    it('should unsubscribe from a list', done => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        const key = '/slug-2';
        let newValue = [
          { val: () => { return 'xyz'; }, getPriority: () => {} }
        ];

        service.processing.current = false;
        const afoList = service.list(key);
        afoList.subscribe(list => {
          expect(list[0].$value).toBe('xyz');
        });
        mockAngularFireDatabase.update('list', newValue);

        afoList.complete();

        expect(afoList.observers.length).toBe(0);
        setTimeout(done);
      })();
    });

    it('should reset', () => {
      inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
        service.list('/slug-2');
        service.object('/slug-3');
        expect(Object.keys(service.listCache).length).toBe(1);
        expect(Object.keys(service.objectCache).length).toBe(1);
        service.reset();
        expect(Object.keys(service.listCache).length).toBe(0);
        expect(Object.keys(service.objectCache).length).toBe(0);
      })();
    });
  });

  it('should return an unwrapped null value', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let newValue = { val: () => { return null; } };
    service.object('/slug-2').subscribe(object => {
      expect(object.$value).toBe(null);
    });
    mockAngularFireDatabase.update('object', newValue);
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
  clear() { }
}

@Injectable()
export class MockAngularFireDatabase extends AngularFireDatabase {
  listData$: any;
  objectData$;
  constructor() {
    super(null);
    this.init();
  }
  init() { }
  update(type, newValue) {
    this[`${type}Data$`].next(newValue);
  }
  list() {
    if (this.listData$ === undefined) {
      this.listData$ = new MockFirebaseListObservable();
    }
    return this.listData$;
  }
  object() {
    if (this.objectData$ === undefined) {
      this.objectData$ = new MockFirebaseObjectObservable();
    }
    return this.objectData$;
  }
}

export const Ref = {
  $ref: {
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
  }
};

@Injectable()
export class MockFirebaseListObservable<T> extends Subject<T> {
  history = [];
  $ref = Ref.$ref;
  constructor() {
    super();
  }
  remove() {
    this.history.push('remove');
    return new Promise(resolve => resolve());
  }
}

@Injectable()
export class MockFirebaseObjectObservable<T> extends Subject<T> {
  history = [];
  $ref = Ref.$ref;
  constructor() {
    super();
  }
  set() {
    this.history.push('set');
    return new Promise(resolve => resolve());
  }
}

export class MockInternalListObservable<T> extends InternalListObservable<T> {
  history = [];
  constructor() {
    super(Ref, null);
  }
  emulate(method, value) {
    this.history.push({
      method: method,
      value: value
    });
  }
}

export class MockAfoObjectObservable<T> extends AfoObjectObservable<T> {
  history = [];
  constructor() {
    super(Ref, null);
  }
  emulate(method, value) {
    this.history.push({
      method: method,
      value: value
    });
  }
}
