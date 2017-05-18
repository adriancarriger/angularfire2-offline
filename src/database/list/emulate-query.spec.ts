/* tslint:disable:no-unused-variable */
import { Injectable, ReflectiveInjector } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs/Rx';

import { EmulateQuery } from './emulate-query';

describe('Emulate Query', () => {
  let emulateQuery: EmulateQuery;
  beforeEach(() => {
    emulateQuery = new EmulateQuery();
  });

  it('should do nothing if the query is undefined', () => {
    emulateQuery.setupQuery({query: undefined});
    expect(emulateQuery.queryReady).toBe(undefined);
    expect(emulateQuery.queryReady instanceof Promise).toBeFalsy();
    expect(Object.keys(emulateQuery.query).length).toBe(0);
  });

  it('should setup a query', () => {
    const testValue = 5;
    const options = {query: {
      limitToFirst: testValue
    }};
    emulateQuery.setupQuery(options);
    expect(emulateQuery.queryReady instanceof Promise).toBeTruthy();
    expect(emulateQuery.query.limitToFirst).toBe(testValue);
  });

  it('should setup a query using an observable', () => {
    const testValue = 6;
    const testSubject = new Subject();
    const options = {query: {
      limitToFirst: testSubject
    }};
    emulateQuery.setupQuery(options);
    testSubject.next(testValue);
    expect(emulateQuery.queryReady instanceof Promise).toBeTruthy();
    expect(emulateQuery.query.limitToFirst).toBe(testValue);
  });

  // Common scenarios
  [
    // // Undefined
    {options: undefined,                          value: undefined, expected: undefined},
    {options: {query: undefined},                 value: undefined, expected: undefined},
    {options: {query: {someKey: undefined}},      value: undefined, expected: undefined},
    // Limit to first
    {options: {query: {limitToFirst: 2}},         value: [],        expected: []},
    {options: {query: {limitToFirst: 2}},         value: [1, 2, 3], expected: [1, 2]},
    // Limit to last
    {options: {query: {limitToLast: 2}},          value: [],        expected: []},
    {options: {query: {limitToLast: 2}},          value: [1, 2, 3], expected: [2, 3]},
    // Order by child
    {
      options: {query: {orderByChild: 'test'}},
      value: [{test: 3}, {test: 1}, {test: 2}, {test: 2}],
      expected: [{test: 1}, {test: 2}, {test: 2}, {test: 3}]
    },
    {
      options: {query: {orderByChild: 'test'}},
      value: [{test: 'c'}, {test: 'a'}, {test: 'b'}, {test: 'b'}],
      expected: [{test: 'a'}, {test: 'b'}, {test: 'b'}, {test: 'c'}]
    },
    // Order by key
    {
      options: {query: {orderByKey: true}},
      value: [{$key: 3}, {$key: 1}, {$key: 2}, {$key: 2}],
      expected: [{$key: 1}, {$key: 2}, {$key: 2}, {$key: 3}]
    },
    // Order by value
    {
      options: {query: {orderByValue: true}},
      value: [{$value: 3}, {$value: 1}, {$value: 2}, {$value: 2}],
      expected: [{$value: 1}, {$value: 2}, {$value: 2}, {$value: 3}]
    },
    // Equal to
    {
      options: {query: {orderByValue: true, equalTo: 2}},
      value: [{$value: 3}, {$value: 1}, {$value: 2}, {$value: 2}],
      expected: [{$value: 2}, {$value: 2}]
    },
    //  Equal to + limitToFirst
    {
      options: {query: {orderByValue: true, equalTo: 2, limitToFirst: 2}},
      value: [
        {$value: 3},
        {$value: 1},
        {$value: 2, test: 'one'},
        {$value: 2, test: 'two'},
        {$value: 2, test: 'three'}],
      expected: [
        {$value: 2, test: 'one'},
        {$value: 2, test: 'two'}
      ]
    },
    // Equal to + limitToLast
    {
      options: {query: {orderByValue: true, equalTo: 2, limitToLast: 2}},
      value: [
        {$value: 3},
        {$value: 1},
        {$value: 2, test: 'one'},
        {$value: 2, test: 'two'},
        {$value: 2, test: 'three'}],
      expected: [
        {$value: 2, test: 'two'},
        {$value: 2, test: 'three'}
      ]
    },
    // Equal to - with special key
    {
      options: {query: {
        orderByValue: true,
        equalTo: {value: 'special', key: 'someKey'}
      }},
      value: [
        {$value: 3, someKey: 'ordinary'},
        {$value: 7, someKey: 'special'},
        {$value: 2, someKey: 'ordinary'},
        {$value: 1, someKey: 'special'},
        {$value: 5, someKey: 'special'}
      ],
      expected: [
        {$value: 1, someKey: 'special'},
        {$value: 5, someKey: 'special'},
        {$value: 7, someKey: 'special'}
      ]
    },
    // Start at
    {
      options: {query: {startAt: 2, orderByValue: true}},
      value: [{$value: 3}, {$value: 1}, {$value: 2}, {$value: 2}],
      expected: [{$value: 2}, {$value: 2}, {$value: 3}]
    },
    // Start at - with special key
    {
      options: {query: {
        orderByValue: true,
        startAt: {value: 4, key: 'someKey'}
      }},
      value: [
        {$value: 3, someKey: 2},
        {$value: 7, someKey: 1},
        {$value: 2, someKey: 7},
        {$value: 1, someKey: 9},
        {$value: 5, someKey: 4}
      ],
      expected: [
        {$value: 1, someKey: 9},
        {$value: 2, someKey: 7},
        {$value: 5, someKey: 4}
      ]
    },
    // End at
    {
      options: {query: {endAt: 2, orderByValue: true}},
      value: [{$value: 3}, {$value: 1}, {$value: 2}, {$value: 2}],
      expected: [{$value: 1}, {$value: 2}, {$value: 2}]
    },
    // End at - with special key
    {
      options: {query: {
        orderByValue: true,
        endAt: {value: 4, key: 'someKey'}
      }},
      value: [
        {$value: 3, someKey: 2},
        {$value: 7, someKey: 1},
        {$value: 2, someKey: 7},
        {$value: 1, someKey: 9},
        {$value: 5, someKey: 4}
      ],
      expected: [
        {$value: 3, someKey: 2},
        {$value: 5, someKey: 4},
        {$value: 7, someKey: 1}
      ]
    },
    // Order by priority
    {
      options: {query: { orderByPriority: true }},
      value: [
        {$value: 3, $priority: 23},
        {$value: 7, $priority: 1000},
        {$value: 2, $priority: 10},
        {$value: 1},
        {$value: 5}
      ],
      expected: [
        {$value: 2, $priority: 10},
        {$value: 3, $priority: 23},
        {$value: 7, $priority: 1000},
        {$value: 1},
        {$value: 5}
      ]
    },
  ].forEach(scenario => {
    const queryText = scenario.options && scenario.options.query
      ? readable(scenario.options.query) : 'an undefined value';
    it(`should use ${queryText} to return ${readable(scenario.expected)}`, done => {
      // Setup query
      emulateQuery.setupQuery(scenario.options);
      emulateQuery.emulateQuery(scenario.value)
        .then(result => {
          expect(result).toEqual(scenario.expected);
          done();
        });
    });
  });

  // Error scenarios
  [
    {limitToFirst: 1, limitToLast: 1},
    {equalTo: 1, startAt: 1},
    {equalTo: 1, endAt: 1}
  ].forEach(query => {
    it(`should throw error if using ${readable(query)}`, done => {
      // Setup query
      let error;
      emulateQuery.setupQuery({query: query});
      emulateQuery.emulateQuery([1, 2, 3]).catch(newError => error = newError);
      setTimeout(() => {
        expect(error).toBeDefined();
        done();
      });
    });
  });
});

function readable(object) {
  const maxLength = 50;
  const base = object ? JSON.stringify(object) : 'an undefined value';
  return base.length > maxLength ? base.substr(0, maxLength) + '…' : base;
}
