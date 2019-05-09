import * as memoizee from 'memoizee';

export function Memoize(): MethodDecorator {
  return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const oldFunction = descriptor.value;
    descriptor.value = memoizee(oldFunction);
    return descriptor;
  };
}
