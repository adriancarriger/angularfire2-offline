import {
  Optional,
  SkipSelf,
} from '@angular/core';

export function TOP_PROVIDER_FACTORY(Service) {
  return {
    provide: Service,
    deps: [[new Optional(), new SkipSelf(), Service]],
    useFactory: (parentDispatcher) => (parentDispatcher || new Service)
  };
}
