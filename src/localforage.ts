import {
  OpaqueToken,
  Optional,
  SkipSelf } from '@angular/core';
import * as localforage from 'localforage';

export const LocalForageToken = new OpaqueToken('localforage');

export const LOCALFORAGE_PROVIDER = {
  provide: LocalForageToken,
  useValue: localforage,
};
