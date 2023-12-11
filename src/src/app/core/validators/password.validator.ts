import {AbstractControl, ValidatorFn} from '@angular/forms';

export class PasswordValidator {
  public static samePasswords(name: string): ValidatorFn {
    return (control: AbstractControl) => {
      let form = control.parent;
      return form?.get(name)?.value === control.value ? null : {samePasswords: true};
    };
  }

  public static differentPasswords(name: string): ValidatorFn {
    return (control: AbstractControl) => {
      if ((control.value ?? '') === '') {
        return null;
      }
      let form = control.parent;
      return (form?.get(name)?.value !== control.value) ? null : {differentPasswords: true};
    };
  }
}
