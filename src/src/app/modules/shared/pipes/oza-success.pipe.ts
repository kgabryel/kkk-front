import type { PipeTransform, Signal } from '@angular/core';

import { Pipe, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { State } from '@/app/core/store/oza-supplies/reducers';

import { selectIsLoadedCorrectly } from '@/app/core/store/oza-supplies/selectors';

@Pipe({
  name: 'ozaSuccess',
})
export class OzaSuccessPipe implements PipeTransform {
  private store: Store<State> = inject<Store<State>>(Store);

  public transform(_value: unknown): Signal<boolean> {
    return this.store.selectSignal(selectIsLoadedCorrectly);
  }
}
