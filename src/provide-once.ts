import { Optional, SkipSelf } from '@angular/core';
import { reflector } from '@angular/core/src/reflection/reflection';
import { ReflectionCapabilities } from '@angular/core/src/reflection/reflection_capabilities';

export function ProvideOnce(input) {
  return {
    provide: input,
    deps: [[new Optional(), new SkipSelf(), input], ...reflector.parameters(input)],
    useFactory: (parent, ...args) => parent || reflector.factory(input).apply(this, [...args])
  };
}
