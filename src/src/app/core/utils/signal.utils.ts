import { computed, effect, signal, Signal, WritableSignal } from '@angular/core';

export class SignalUtils {
  public static watchSignalValue(
    callback: () => void,
    signal: Signal<unknown>,
    ...additional: Signal<unknown>[]
  ): void {
    effect(() => {
      signal();
      additional.forEach((s: Signal<unknown>) => s());
      callback();
    });
  }

  public static reactToSignalValue<T>(signal: Signal<T>, callback: (value: T) => void): void {
    effect(() => {
      const result = signal();
      callback(result);
    });
  }

  public static map<T, R>(signal: Signal<T>, callback: (value: T) => R): Signal<R> {
    return computed(() => callback(signal()));
  }

  public static makeWritable<T>(source: Signal<T>): WritableSignal<T> {
    const writable = signal(source());
    effect(() => writable.set(source()));

    return writable;
  }

  public static arrayToCount<T>(signal: Signal<T[]>): Signal<number> {
    return SignalUtils.map<T[], number>(signal, (values: T[]) => values.length);
  }
}
