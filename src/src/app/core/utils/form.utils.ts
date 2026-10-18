import { Injector, runInInjectionContext, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { EMPTY } from 'rxjs';

import { SignalUtils } from './signal.utils';

export abstract class FormUtils {
  public static clearInputs(form: FormGroup, value: unknown, ...names: string[]): void {
    names.forEach((name: string) => {
      form.get(name)?.reset(value);
      form.get(name)?.setErrors(null);
      form.get(name)?.markAsUntouched();
    });
  }

  public static getLength(
    injector: Injector,
    form: FormGroup,
    fieldName: string,
    initialValue: string = '',
  ): Signal<number> {
    return runInInjectionContext(injector, () =>
      SignalUtils.map<string, number>(
        toSignal(form.get(fieldName)?.valueChanges ?? EMPTY, { initialValue }),
        (value: string) => value.length,
      ),
    );
  }
}
