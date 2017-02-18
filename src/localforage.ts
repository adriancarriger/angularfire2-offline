import {
  OpaqueToken,
  Optional,
  SkipSelf } from '@angular/core';
import * as localforage from 'localforage';

export function LocalForageToken() {
  return new OpaqueToken('localforage');
}

export function localforageFactory() {
  return localforage;
}

export const LOCALFORAGE_PROVIDER = {
  provide: LocalForageToken,
  useFactory: localforageFactory
};
