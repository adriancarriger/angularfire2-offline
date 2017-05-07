/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import {
  LocalUpdateService,
  LOCAL_UPDATE_SERVICE_PROVIDER_FACTORY } from './local-update-service';
import { LocalForageToken } from './localforage';
import { WriteCache } from './interfaces';

describe('Service: LocalUpdateService', () => {
  let mockLocalForageService: MockLocalForageService;
  beforeEach(() => {
    mockLocalForageService = new MockLocalForageService();
    TestBed.configureTestingModule({
      providers: [
        LocalUpdateService,
        { provide: LocalForageToken, useValue: mockLocalForageService }
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents();
  }));

  it('should create the service', inject([LocalUpdateService], (service: LocalUpdateService) => {
    expect(service).toBeTruthy();
  }));

  it('should run an update', inject([LocalUpdateService], (service: LocalUpdateService) => {
    const key = 'key-1';
    service.update(key, x => x + 1);
    service.update(key, x => x + 3);
    mockLocalForageService.update(key, 3);
    setTimeout(() => {
      expect(service.cache[key]).toBe(7);
    });
  }));

  it('should return the parent provider', () => {
    const value = LOCAL_UPDATE_SERVICE_PROVIDER_FACTORY(<any>'parent value', null);
    expect(value).toBe('parent value');
  });

  it('should create a new provider', () => {
    const value = LOCAL_UPDATE_SERVICE_PROVIDER_FACTORY(null, LocalForageToken);
    expect(value instanceof LocalUpdateService).toBe(true);
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
  setItem(setValue) {
    this.setValue = setValue;
    return new Promise(resolve => resolve());
  }
  update(key, value, skipIfNotFound?) {
    if (skipIfNotFound && !(key in this.resolves)) { return; }
    this.resolves[key](value);
  }
}
