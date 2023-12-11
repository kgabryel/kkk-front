import {Store} from '@ngrx/store';
import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {first, map, switchMap} from 'rxjs/operators';
import {State as IngredientsState} from '../store/ingredients/reducers';
import {State as SeasonsState} from '../store/seasons/reducers';
import {selectSeasons} from '../store/seasons/selectors';
import {selectIngredientsWithoutAssignedSeason} from '../store/ingredients/selectors';

export class SeasonsValidator {
  public static exists(ingredientsStore: Store<IngredientsState>, seasonsStore: Store<SeasonsState>): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return seasonsStore.select(selectSeasons).pipe(
        map(seasons => seasons.map(season => season.ingredientId)),
        switchMap(usedIngredients => ingredientsStore.select(selectIngredientsWithoutAssignedSeason(usedIngredients))
          .pipe(map(ingredients => {
              let exists = false;
              ingredients.forEach(ingredient => {
                if (ingredient.name === control.value) {
                  exists = true;
                }
              });
              return exists ? null : {notExists: true};
            })
          )),
        first()
      );
    };
  }
}
