import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';

import { State as SettingsState } from '../../../core/store/settings/reducers';
import { selectAutocomplete } from '../../../core/store/settings/selectors';
import { SignalUtils } from '../../../core/utils/signal.utils';

@Pipe({
  name: 'autocomplete',
  standalone: true,
})
export class AutocompletePipe implements PipeTransform {
  private autocomplete: boolean;
  public constructor(settingsStore: Store<SettingsState>) {
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
