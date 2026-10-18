import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';

import { Ingredient } from '../models/ingredient';
import { State } from '../store/ingredients/reducers';
import { selectByName } from '../store/ingredients/selectors';

export class IngredientsValidator {
  public static unique(store: Store<State>, expect: number = 0): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return store.select(selectByName(control.value)).pipe(
        map((ingredient: Ingredient | undefined) =>
          ingredient === undefined ? null : ingredient.id === expect ? null : { notUnique: true },
        ),
        first(),
      );
    };
  }
}
