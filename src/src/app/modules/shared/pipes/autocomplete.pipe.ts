import type { PipeTransform } from '@angular/core';

import { Pipe, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { State as SettingsState } from '@/app/core/store/settings/reducers';

import { selectAutocomplete } from '@/app/core/store/settings/selectors';
import { SignalUtils } from '@/app/core/utils/signal.utils';

@Pipe({
  name: 'autocomplete',
})
export class AutocompletePipe implements PipeTransform {
  private autocomplete: boolean;
  public constructor() {
    const settingsStore = inject<Store<SettingsState>>(Store);

    this.autocomplete = true;
    SignalUtils.reactToSignalValue(
      settingsStore.selectSignal(selectAutocomplete),
      (autocomplete: boolean) => (this.autocomplete = autocomplete),
    );
  }

  public transform(_value: unknown): string {
    return this.autocomplete ? 'on' : 'off';
  }
}
