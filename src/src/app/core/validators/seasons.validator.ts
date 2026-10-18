import type { Signal } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import type { Ingredient } from '@/app/core/models/ingredient';

export class SeasonsValidator {
  public static exists(ingredients: Signal<Ingredient[]>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === '') {
        return null;
      }
      const exists = ingredients().some((ingredient: Ingredient) => ingredient.name === control.value);

      return exists ? null : { notExists: true };
    };
  }
}
