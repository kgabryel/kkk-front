import {AbstractControl, ValidatorFn} from '@angular/forms';
import {OzaSupply} from '../models/oza-supply';

export class OzaValidator {
  public static exists(supplies: OzaSupply[]): ValidatorFn {
    return (control: AbstractControl) => supplies.find(supply => supply.name === control.value) !== undefined ? null : {notExists: true};
  }
}
