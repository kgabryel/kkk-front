import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Length } from '../../config/form.config';
import { State } from '../store/ingredients/reducers';
import { IngredientsValidator } from '../validators/ingredients.validator';

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
  private readonly store: Store<State>;
  public constructor(store: Store<State>) {
    this.store = store;
  }

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
