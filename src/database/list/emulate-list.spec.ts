/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { EmulateList } from './emulate-list';

describe('Emulate List', () => {
  let emulateList: EmulateList;
  beforeEach(() => {
    emulateList = new EmulateList();
  });

  it('should process the queue', () => {
    const observableValue = [
      { $value: 'some value' }
    ];
    emulateList.observableValue = observableValue;
    emulateList.que.push({
      method: 'remove',
      value: undefined,
      key: undefined
    });
    emulateList.processQue(observableValue);
    expect(emulateList.que.length).toBe(0);
    expect(emulateList.observableValue.length).toBe(0);
  });
});
