import {AbstractControl, ValidatorFn} from '@angular/forms';

export class TimeValidator {
  public static greaterThanZero(): ValidatorFn {
    return (control: AbstractControl) => {
      const timeValue: Date = control.value;
      let time = 0;
      time += timeValue.getSeconds();
      time += 60 * timeValue.getMinutes();
      time += 60 * 60 * timeValue.getHours();
      return time > 0 ? null : {greaterThanZero: true};
    };
  }
}
