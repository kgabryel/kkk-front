import { ChangeDetectionStrategy, Component, computed, OnInit, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';

import { Length } from '../../../../config/form.config';
import { suppliesReset } from '../../../../core/store/oza-supplies/actions';
import { State as SuppliesState } from '../../../../core/store/oza-supplies/reducers';
import { changeOzaKey, switchAutocomplete } from '../../../../core/store/settings/actions';
import { State as SettingsState } from '../../../../core/store/settings/reducers';
import { selectAutocomplete, selectOzaKey } from '../../../../core/store/settings/selectors';
import { BaseComponent } from '../../../base.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSlideToggle,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatHint,
    AutocompletePipe,
    MatInput,
    MatButton,
    MatIcon,
  ],
  selector: 'account-settings',
  standalone: true,
  styleUrls: ['./settings.component.scss'],
  templateUrl: './settings.component.html',
})
export class SettingsComponent extends BaseComponent implements OnInit {
  public autocomplete!: Signal<boolean>;
  public keyField: FormControl;
  public length!: Signal<number>;
  public maxKeyLength: number;
  private settingsStore: Store<SettingsState>;
  private suppliesStore: Store<SuppliesState>;
  public constructor(settingsStore: Store<SettingsState>, suppliesStore: Store<SuppliesState>) {
    super();
    this.settingsStore = settingsStore;
    this.suppliesStore = suppliesStore;
    this.maxKeyLength = Length.maxOzaKeyLength;
    this.keyField = new FormControl();
  }

  public ngOnInit(): void {
    const ozaKey = this.settingsStore.selectSignal(selectOzaKey);
    const keyField = this.signalFromObservable(this.keyField.valueChanges, undefined);
    this.length = computed(() => {
      const keyValue = ozaKey();
      const fieldValue = keyField();
      const key = keyValue ?? fieldValue;

      return key ? key.length : 0;
    });

    this.autocomplete = this.settingsStore.selectSignal(selectAutocomplete);
  }

  public changeOzaKey(e: Event): void {
    e.preventDefault();
    this.settingsStore.dispatch(
      changeOzaKey({
        key: this.keyField.value,
      }),
    );
    this.suppliesStore.dispatch(suppliesReset());
  }

  public switchAutocomplete(): void {
    this.settingsStore.dispatch(switchAutocomplete());
  }
}
