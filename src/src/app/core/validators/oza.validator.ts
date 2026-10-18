import { AbstractControl, ValidatorFn } from '@angular/forms';

import { OzaSupply } from '../models/oza-supply';

export class OzaValidator {
  public static exists(supplies: OzaSupply[]): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value === '') {
        return null;
      }
      const exists = supplies.some((supply: OzaSupply) => supply.name === control.value);

      if (exists) {
        return null;
      }

      return { notExists: true };
    };
  }
}
