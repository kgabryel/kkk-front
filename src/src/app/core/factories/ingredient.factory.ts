import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import type { State } from '@/app/core/store/ingredients/reducers';

import { Length } from '@/app/config/form.config';
import { IngredientsValidator } from '@/app/core/validators/ingredients.validator';

export interface IngredientsFormNames {
  name: string;
  available: string;
  supply: string;
  supplySearch: string;
}

export const formNames: IngredientsFormNames = {
  available: 'available',
  name: 'name',
  supply: 'supply',
  supplySearch: 'supplySearch',
};

@Injectable()
export class IngredientFormFactory {
  private readonly store: Store<State> = inject<Store<State>>(Store);

  public getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.available]: new FormControl(false, [Validators.required]),
      [formNames.name]: new FormControl(
        '',
        [Validators.required, Validators.maxLength(Length.maxIngredientNameLength)],
        [IngredientsValidator.unique(this.store)],
      ),
      [formNames.supply]: new FormControl(null),
      [formNames.supplySearch]: new FormControl(null),
    });
  }

  public getEditForm(expect: number = 0): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(
        '',
        [Validators.required, Validators.maxLength(Length.maxIngredientNameLength)],
        [IngredientsValidator.unique(this.store, expect)],
      ),
    });
  }
}
