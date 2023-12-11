import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../store/ingredients/reducers';
import {first, map} from 'rxjs/operators';
import {selectIngredients} from '../store/ingredients/selectors';

export class RecipePositionsValidator {
  public static exists(ingredientsStore: Store<IngredientsState>): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return ingredientsStore.select(selectIngredients).pipe(
        map(ingredients => ingredients.map(ingredient => ingredient.id)),
        map(ingredients => ingredients.includes(control.value) ? null : {notExists: true}),
        first()
      );
    };
  }
}
