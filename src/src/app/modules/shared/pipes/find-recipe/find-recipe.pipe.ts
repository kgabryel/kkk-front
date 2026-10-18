import {Pipe, PipeTransform} from '@angular/core';
import {State} from '../../../../core/store/recipes/reducers';
import {Store} from '@ngrx/store';
import {selectById} from '../../../../core/store/recipes/selectors';
import {Observable} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';

@Pipe({
  name: 'findRecipe'
})
export class FindRecipePipe implements PipeTransform {

  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  transform(value: number, ...args: unknown[]): Observable<Recipe | undefined> {
    return this.store.select(selectById(value));
  }
}
