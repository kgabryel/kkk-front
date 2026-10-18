import { Signal } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Ingredient } from '../models/ingredient';

export class SeasonsValidator {
  public static exists(ingredients: Signal<Ingredient[]>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === '') {
        return null;
      }
      const exists = ingredients().some(
        (ingredient: Ingredient) => ingredient.name === control.value,
      );

      return exists ? null : { notExists: true };
    };
  }
}
