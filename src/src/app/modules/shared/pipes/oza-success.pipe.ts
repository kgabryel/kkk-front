import { Pipe, PipeTransform, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../../core/store/oza-supplies/reducers';
import { selectIsLoadedCorrectly } from '../../../core/store/oza-supplies/selectors';

@Pipe({
  name: 'ozaSuccess',
  standalone: true,
})
export class OzaSuccessPipe implements PipeTransform {
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.store = store;
  }

  public transform(_value: unknown): Signal<boolean> {
    return this.store.selectSignal(selectIsLoadedCorrectly);
  }
}
