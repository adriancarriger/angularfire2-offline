/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { AngularFireOfflineDatabase } from '../src/database';
import { LocalForageToken } from '../src/localforage';
import { ProvideOnce } from '../src/provide-once';

describe('Service: AngularFireOfflineDatabase', () => {
  let mockAngularFire: MockAngularFire;
  let mockNg2LocalforageService: MockNg2LocalforageService;
  beforeEach(() => {
    mockAngularFire = new MockAngularFire();
    mockNg2LocalforageService = new MockNg2LocalforageService();
    TestBed.configureTestingModule({
      providers: [
        AngularFireOfflineDatabase,
        { provide: AngularFire, useValue: mockAngularFire },
        { provide: LocalForageToken, useValue: mockNg2LocalforageService }
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
    let newValue = [
      { val: () => { return 'xyz'; } }
    ];
    service.list('slug-2').subscribe(list => {
      expect(list[0]).toBe('xyz');
    });
    expect(service.cache['slug-2'].loaded).toBe(false);
    mockAngularFire.update(newValue);
  })));

  it('should not setup a list', inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    // Setup test - Set up list
    service.list('slug-2', {});
    // If `setupObject` is called, then this will be false: 
    expect(service.cache['slug-2'].loaded).toBe(false);
    // Setting to true
    service.cache['slug-2'].loaded = true;
    // Test
    service.list('slug-2');
    // Will still be true if `setupObject` was not called
    expect(service.cache['slug-2'].loaded).toBe(true);
  }));

  it('should return an object', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    let newValue = { val: () => { return 'abc23-7'; } };
    service.object('slug-2').subscribe(object => {
      expect(object).toBe('abc23-7');
    });
    mockAngularFire.update(newValue);
  })));

  it('should not setup an object', inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    // Setup test - Set up list
    service.object('slug-2', {});
    // If `setupObject` is called, then this will be false: 
    expect(service.cache['slug-2'].loaded).toBe(false);
    // Setting to true
    service.cache['slug-2'].loaded = true;
    // Test
    service.object('slug-2');
    // Will still be true if `setupObject` was not called
    expect(service.cache['slug-2'].loaded).toBe(true);
  }));

  it('should return a locally stored value', async(inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
    service.object('slug-2').subscribe(object => {
      expect(object).toBe('293846488sxjfhslsl20201-4ghcjs');
    });
   mockNg2LocalforageService.update('293846488sxjfhslsl20201-4ghcjs');
  })));

  it('should not return a locally stored value if loaded', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      let returnedValue = false;
      service.object('slug-2').subscribe(object => {
        returnedValue = true;
      });
      service.cache['slug-2'].loaded = true;
      mockNg2LocalforageService.update('293846488sxjfhslsl20201-4ghcjs');
      // Wait for 500 ms to see if a value is returned
      setTimeout(() => {
        expect(returnedValue).toBe(false);
        done();
      }, 500);
    })();
  });

  // it('should return a locally stored list', done => {
  //   inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
  //     service.list('list-2').subscribe(object => {
  //       expect(object).toEqual(['1', '1', '1']);
  //       done();
  //     });
  //     mockNg2LocalforageService.update(['key-1', 'key-2', 'key-3'], true);
  //     mockNg2LocalforageService.update('1');
  //   })();
  // });

  it('should not return alocally stored list if loaded', done => {
    inject([AngularFireOfflineDatabase], (service: AngularFireOfflineDatabase) => {
      let returnedValue = false;
      service.list('list-2').subscribe(object => {
        returnedValue = true;
      });
      service.cache['list-2'].loaded = true;
      mockNg2LocalforageService.update(['key-1', 'key-2', 'key-3'], true);
      mockNg2LocalforageService.update('1');
      // Wait for 500 ms to see if a value is returned
      setTimeout(() => {
        expect(returnedValue).toBe(false);
        done();
      }, 500);
    })();
  });

  it('should create a provider', async(inject([AngularFireOfflineDatabase, AngularFire],
    (service: AngularFireOfflineDatabase, af: AngularFire) => {
    const provider = ProvideOnce(AngularFireOfflineDatabase);
    const factory = provider.useFactory;
    const newService = factory(service, AngularFire);
    expect(newService).toBe(service);
  })));

  it('should create a provider that creates a new service if one does not exist',
    async(inject([AngularFireOfflineDatabase, AngularFire],
    (service: AngularFireOfflineDatabase, af: AngularFire) => {
    const provider = ProvideOnce(AngularFireOfflineDatabase);
    const factory = provider.useFactory;
    const newService = factory(null, AngularFire);
    expect(newService instanceof AngularFireOfflineDatabase).toBe(true);
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
export class MockNg2LocalforageService {
  item;
  list;
  constructor() {
    this.onInit();
  }
  onInit() {
    this.item = new Subject();
    this.list = new ReplaySubject();
  }
  getItem(input) {
    if (input === 'list-2') {
      return this.list.asObservable().toPromise();
    }
    return this.item.asObservable().toPromise();
  }
  setItem(input) {

  }
  update(updateInput, list?: boolean) {
    if (list) {
      this.list.next(updateInput);
    } else {
      this.item.next(updateInput);
      this.item.complete();
    }
  }
}

@Injectable()
export class MockAngularFire {
  recipeList$;
  input;
  database = {
    list: (input: string, query?) => {
      return this.recipeList$.asObservable();
    },
    object: (input: string, query?) => {
      this.input = input;
      return this.recipeList$.asObservable();
    }
  };
  private mockArray: Array<Object>;
  constructor() {
    this.mockArray = MockApiData;
    this.recipeList$ = new Subject();
    this.update();
  }
  update(newValue?) {
    let nextObj;
    if (this.input === 'client/recipes/slug-2') {
      nextObj = this.mockArray[1];
    } else {
      nextObj = this.mockArray;
    }
    nextObj = { val: () => { return nextObj; } };
    if (newValue) {
      nextObj = newValue;
    }
    this.recipeList$.next(nextObj);
  }
}
