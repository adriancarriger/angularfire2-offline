import {
  OpaqueToken,
  Optional,
  SkipSelf } from '@angular/core';
import * as localforage from 'localforage';


export function LocalForageToken() {
    return new OpaqueToken('localforage');
}

export function LOCALFORAGE_PROVIDER_FACTORY() {
  return localforage;
};

export const LOCALFORAGE_PROVIDER = {
  provide: LocalForageToken,
  useFactory: LOCALFORAGE_PROVIDER_FACTORY,
};
