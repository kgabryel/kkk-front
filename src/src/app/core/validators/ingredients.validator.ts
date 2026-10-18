import type { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import type { Store } from '@ngrx/store';

import { first, map } from 'rxjs/operators';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { State } from '@/app/core/store/ingredients/reducers';

import { selectByName } from '@/app/core/store/ingredients/selectors';

export class IngredientsValidator {
  public static unique(store: Store<State>, expect = 0): AsyncValidatorFn {
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
