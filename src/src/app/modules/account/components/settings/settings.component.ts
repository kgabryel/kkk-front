import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {State as SuppliesState} from '../../../../core/store/oza-supplies/reducers';
import {changeOzaKey, switchAutocomplete} from '../../../../core/store/settings/actions';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {selectAutocomplete, selectOzaKey} from '../../../../core/store/settings/selectors';
import {Length} from '../../../../config/form.config';
import {FormControl} from '@angular/forms';
import {suppliesReset} from '../../../../core/store/oza-supplies/actions';

@Component({
  selector: 'account-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {
  public autocomplete$: Observable<boolean>;
  public maxKeyLength: number;
  public length$: BehaviorSubject<number>;
  public keyField: FormControl;
  private settingsStore: Store<SettingsState>;
  private suppliesStore: Store<SuppliesState>;
  private subscriptions: Subscription[];

  public constructor(settingsStore: Store<SettingsState>, suppliesStore: Store<SuppliesState>) {
    this.settingsStore = settingsStore;
    this.suppliesStore = suppliesStore;
    this.maxKeyLength = Length.maxOzaKeyLength;
    this.keyField = new FormControl();
  }

  public ngOnInit(): void {
    this.length$ = new BehaviorSubject<number>(0);
    this.autocomplete$ = this.settingsStore.select(selectAutocomplete);
    this.subscriptions = [
      this.settingsStore.select(selectOzaKey).subscribe(key => {
        this.keyField.setValue(key);
        this.length$.next(key === null ? 0 : key.length);
      }),
      this.keyField.valueChanges.subscribe(data => this.length$.next(data === null ? 0 : data.length))
    ];
  }

  public switchAutocomplete(): void {
    this.settingsStore.dispatch(switchAutocomplete());
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public changeOzaKey(e: any): void {
    e.preventDefault();
    this.settingsStore.dispatch(changeOzaKey({
      key: this.keyField.value
    }));
    this.suppliesStore.dispatch(suppliesReset());
  }
}
