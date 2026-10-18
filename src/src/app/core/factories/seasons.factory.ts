import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { State as IngredientsState } from '../store/ingredients/reducers';
import { selectIngredientsWithoutSeason } from '../store/ingredients/selectors';
import { SeasonsValidator } from '../validators/seasons.validator';

export interface SeasonsFormNames {
  ingredient: string;
  startMonth: string;
  endMonth: string;
}

export const formNames: SeasonsFormNames = {
  endMonth: 'endMonth',
  ingredient: 'ingredient',
  startMonth: 'startMonth',
};

@Injectable()
export class SeasonsFormFactory {
  private readonly ingredientsStore: Store<IngredientsState>;
  public constructor(ingredientsStore: Store<IngredientsState>) {
    this.ingredientsStore = ingredientsStore;
  }

  public getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.endMonth]: new FormControl('', [Validators.required]),
      [formNames.ingredient]: new FormControl('', [
        Validators.required,
        SeasonsValidator.exists(this.ingredientsStore.selectSignal(selectIngredientsWithoutSeason)),
      ]),
      [formNames.startMonth]: new FormControl('', [Validators.required]),
    });
  }

  public getEditForm(): FormGroup {
    return new FormGroup({
      [formNames.endMonth]: new FormControl('', [Validators.required]),
      [formNames.startMonth]: new FormControl('', [Validators.required]),
    });
  }
}
