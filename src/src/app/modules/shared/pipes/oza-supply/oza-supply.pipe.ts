import {Pipe, PipeTransform} from '@angular/core';
import {State} from '../../../../core/store/oza-supplies/reducers';
import {Store} from '@ngrx/store';
import {selectById} from '../../../../core/store/oza-supplies/selectors';
import {Observable} from 'rxjs';
import {OzaSupply} from '../../../../core/models/oza-supply';

@Pipe({
  name: 'ozaSupply'
})
export class OzaSupplyPipe implements PipeTransform {

  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  transform(value: number, ...args: unknown[]): Observable<OzaSupply | undefined> {
    return this.store.select(selectById(value));
  }
}
