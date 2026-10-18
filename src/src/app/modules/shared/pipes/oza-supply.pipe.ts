import type { PipeTransform, Signal } from '@angular/core';

import { Pipe, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { OzaSupply } from '@/app/core/models/oza-supply';
import type { State } from '@/app/core/store/oza-supplies/reducers';

import { selectById } from '@/app/core/store/oza-supplies/selectors';

@Pipe({
  name: 'ozaSupply',
})
export class OzaSupplyPipe implements PipeTransform {
  private store: Store<State> = inject<Store<State>>(Store);

  public transform(value: number): Signal<OzaSupply | undefined> {
    return this.store.selectSignal(selectById(value));
  }
}
