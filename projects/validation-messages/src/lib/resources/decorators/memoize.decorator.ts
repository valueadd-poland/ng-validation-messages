import * as memoizee from 'memoizee';

export function memoize(): MethodDecorator {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    const oldFunction = descriptor.value;
    descriptor.value = memoizee(oldFunction);
    return descriptor;
  };
}
