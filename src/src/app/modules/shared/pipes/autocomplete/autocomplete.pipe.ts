import {Pipe, PipeTransform} from '@angular/core';
import {Store} from '@ngrx/store';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {selectAutocomplete} from '../../../../core/store/settings/selectors';

@Pipe({
  name: 'autocomplete'
})
export class AutocompletePipe implements PipeTransform {

  private autocomplete: boolean;

  public constructor(settingsStore: Store<SettingsState>) {
    this.autocomplete = true;
    settingsStore.select(selectAutocomplete).subscribe(autocomplete => this.autocomplete = autocomplete);
  }

  transform(value: unknown, ...args: unknown[]): string {
    return this.autocomplete ? 'on' : 'off';
  }
}
