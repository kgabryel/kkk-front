import { Pipe, PipeTransform, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { OzaSupply } from '../../../core/models/oza-supply';
import { State } from '../../../core/store/oza-supplies/reducers';
import { selectById } from '../../../core/store/oza-supplies/selectors';

@Pipe({
  name: 'ozaSupply',
  standalone: true,
})
export class OzaSupplyPipe implements PipeTransform {
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.store = store;
  }

  public transform(value: number): Signal<OzaSupply | undefined> {
    return this.store.selectSignal(selectById(value));
  }
}
