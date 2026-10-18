import {Pipe, PipeTransform} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/oza-supplies/reducers';
import {Observable} from 'rxjs';
import {selectIsLoadedCorrectly} from '../../../../core/store/oza-supplies/selectors';

@Pipe({
  name: 'ozaSuccess'
})
export class OzaSuccessPipe implements PipeTransform {
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  transform(value: null, ...args: unknown[]): Observable<boolean> {
    return this.store.select(selectIsLoadedCorrectly);
  }
}
