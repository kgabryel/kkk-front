import { AbstractControl, ValidatorFn } from '@angular/forms';

export class UrlValidator {
  public static url(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) {
        return null;
      }
      try {
        const url = new URL(value);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          return { url: true };
        }
        return null;
      } catch {
        return { url: true };
      }
    };
  }
}
