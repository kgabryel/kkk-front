import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { State as SettingsState } from '../../../../core/store/settings/reducers';
import { selectUserType } from '../../../../core/store/settings/selectors';
import { DividerComponent } from '../../../layout/components/divider/divider.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { GenerateKeyButtonComponent } from '../../components/generate-key-button/generate-key-button.component';
import { KeysComponent } from '../../components/keys/keys.component';
import { LogoutBtnComponent } from '../../components/logout-btn/logout-btn.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { TimersComponent } from '../../components/timers/timers.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LogoutBtnComponent,
    SettingsComponent,
    TimersComponent,
    KeysComponent,
    GenerateKeyButtonComponent,
    ChangePasswordComponent,
    DividerComponent,
  ],
  selector: 'account-pages-index',
  standalone: true,
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  public userType!: Signal<string>;
  private settingsStore: Store<SettingsState>;
  public constructor(settingsStore: Store<SettingsState>) {
    this.settingsStore = settingsStore;
  }

  public ngOnInit(): void {
    this.userType = this.settingsStore.selectSignal(selectUserType);
  }
}
