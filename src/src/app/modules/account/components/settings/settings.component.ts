import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';

import type { State as SuppliesState } from '@/app/core/store/oza-supplies/reducers';
import type { State as SettingsState } from '@/app/core/store/settings/reducers';

import { Length } from '@/app/config/form.config';
import { suppliesReset } from '@/app/core/store/oza-supplies/actions';
import { changeOzaKey, switchAutocomplete } from '@/app/core/store/settings/actions';
import { selectAutocomplete, selectOzaKey } from '@/app/core/store/settings/selectors';
import { BaseComponent } from '@/app/modules/base.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

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
  styleUrl: './settings.component.scss',
  templateUrl: './settings.component.html',
})
export class SettingsComponent extends BaseComponent implements OnInit {
  public autocomplete!: Signal<boolean>;
  public keyField: FormControl;
  public length!: Signal<number>;
  public maxKeyLength: number = Length.maxOzaKeyLength;
  private settingsStore: Store<SettingsState> = inject<Store<SettingsState>>(Store);
  private suppliesStore: Store<SuppliesState> = inject<Store<SuppliesState>>(Store);
  public constructor() {
    super();
    this.keyField = new FormControl();
    this.autocomplete = this.settingsStore.selectSignal(selectAutocomplete);
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
