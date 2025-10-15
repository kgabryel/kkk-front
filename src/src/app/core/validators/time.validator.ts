import { AbstractControl, ValidatorFn } from '@angular/forms';

import { Time } from '../models/time';

export class TimeValidator {
  public static greaterThanZero(): ValidatorFn {
    return (control: AbstractControl) => {
      const timeValue: Time = control.value;
      let time = 0;
      time += timeValue.second;
      time += 60 * timeValue.minute;
      time += 60 * 60 * timeValue.hour;

      return time > 0 ? null : { greaterThanZero: true };
    };
  }
}
