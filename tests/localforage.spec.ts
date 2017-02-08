import { OpaqueToken } from '@angular/core';

import { LocalForageToken, LOCALFORAGE_PROVIDER_FACTORY } from '../src/localforage';

describe('Module: LocalForage', () => {
  it('should create a token', () => {
    const token: any = LocalForageToken();
    expect(token instanceof OpaqueToken).toBe(true);
    expect(token._desc).toBe('localforage');
  });

  it('should create a provider', () => {
    const provider: any = LOCALFORAGE_PROVIDER_FACTORY();
    expect(provider.LOCALFORAGE_PROVIDER_FACTORY.name).toBe('LOCALFORAGE_PROVIDER_FACTORY');
  });
});
