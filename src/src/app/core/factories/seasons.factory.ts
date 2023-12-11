import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SeasonsValidator} from '../validators/seasons.validator';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../store/ingredients/reducers';
import {State as SeasonsState} from '../store/seasons/reducers';
import {Injectable} from '@angular/core';

export interface SeasonsFormNames {
  ingredient: string,
  startMonth: string,
  endMonth: string
}

export const formNames: SeasonsFormNames = {
  ingredient: 'ingredient',
  startMonth: 'startMonth',
  endMonth: 'endMonth'
};

@Injectable()
export class SeasonsFormFactory {
  private readonly seasonsStore: Store<SeasonsState>;
  private readonly ingredientsStore: Store<IngredientsState>;

  public constructor(seasonsStore: Store<SeasonsState>, ingredientsStore: Store<IngredientsState>) {
    this.seasonsStore = seasonsStore;
    this.ingredientsStore = ingredientsStore;
  }

  public getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.ingredient]: new FormControl(
        '',
        [Validators.required],
        [SeasonsValidator.exists(this.ingredientsStore, this.seasonsStore)]
      ),
      [formNames.startMonth]: new FormControl('', [Validators.required]),
      [formNames.endMonth]: new FormControl('', [Validators.required])
    });
  }

  public getEditForm(): FormGroup {
    return new FormGroup({
      [formNames.startMonth]: new FormControl('', [Validators.required]),
      [formNames.endMonth]: new FormControl('', [Validators.required])
    });
  }
}
