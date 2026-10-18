import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';
import {State as SuppliesState} from '../store/oza-supplies/reducers';
import {State as SettingsState} from '../store/settings/reducers';
import {keyNotExists, suppliesLoad} from '../store/oza-supplies/actions';
import {selectIsLoaded} from '../store/oza-supplies/selectors';
import {selectIsLoaded as settingsLoaded, selectOzaKey} from '../store/settings/selectors';

@Injectable()
export class SuppliesResolver implements Resolve<boolean> {

  private readonly suppliesStore: Store<SuppliesState>;
  private readonly settingsStore: Store<SettingsState>;

  constructor(suppliesStore: Store<SuppliesState>, settingsStore: Store<SettingsState>) {
    this.suppliesStore = suppliesStore;
    this.settingsStore = settingsStore;
  }

  resolve(): Observable<boolean> {
    const s1 = this.suppliesStore.select(selectIsLoaded);
    const s2 = this.settingsStore.select(settingsLoaded).pipe(
      filter(loaded => loaded),
      switchMap(() => this.settingsStore.select(selectOzaKey)));
    return combineLatest(s1, s2).pipe(
      tap(values => {
        if (!values[0]) {
          if (values[1] === null || values[1] === '') {
            this.suppliesStore.dispatch(keyNotExists());
          } else {
            this.suppliesStore.dispatch(suppliesLoad());
          }
        }
      }),
      filter(values => values[0]),
      take(1),
      map(values => values[0])
    );
  }
}
