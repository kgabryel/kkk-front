import { inject, Injector, runInInjectionContext, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { SignalUtils } from '../core/utils/signal.utils';

export abstract class BaseComponent {
  protected readonly injector: Injector = inject(Injector);

  protected onObservable(
    callback: () => void,
    observable: Observable<unknown>,
    ...additional: Observable<unknown>[]
  ): void {
    runInInjectionContext(this.injector, () =>
      SignalUtils.watchSignalValue(
        callback,
        toSignal(observable),
        ...additional.map((obs: Observable<unknown>) => toSignal(obs)),
      ),
    );
  }

  protected onObservableValue<T>(
    callback: (value: T) => void,
    observable: Observable<T>,
    initialValue: T,
  ): void {
    runInInjectionContext(this.injector, () =>
      SignalUtils.reactToSignalValue(toSignal(observable, { initialValue }), callback),
    );
  }

  protected mapToSignal<T, R>(
    input: Observable<T>,
    callback: (value: T) => R,
    initialValue: T,
  ): Signal<R> {
    return runInInjectionContext(this.injector, () =>
      SignalUtils.map(toSignal(input, { initialValue }), callback),
    );
  }
  protected onSignalValue<T>(callback: (value: T) => void, signal: Signal<T>): void {
    runInInjectionContext(this.injector, () => SignalUtils.reactToSignalValue(signal, callback));
  }

  protected signalFromObservable<T>(observable: Observable<T>, initialValue: T): Signal<T> {
    return runInInjectionContext(this.injector, () => toSignal(observable, { initialValue }));
  }
}
