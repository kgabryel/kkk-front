import {FormGroup} from '@angular/forms';

export abstract class FormUtils {
  public static clearInputs(form: FormGroup, value: any, ...names: string[]): void {
    names.forEach(name => {
      form.get(name)?.reset(value);
      form.get(name)?.setErrors(null);
      form.get(name)?.markAsUntouched();
    });
  }
}
