import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { State as SettingsState } from '@/app/core/store/settings/reducers';

import { selectUserType } from '@/app/core/store/settings/selectors';
import { ChangePasswordComponent } from '@/app/modules/account/components/change-password/change-password.component';
import { GenerateKeyButtonComponent } from '@/app/modules/account/components/generate-key-button/generate-key-button.component';
import { KeysComponent } from '@/app/modules/account/components/keys/keys.component';
import { LogoutBtnComponent } from '@/app/modules/account/components/logout-btn/logout-btn.component';
import { SettingsComponent } from '@/app/modules/account/components/settings/settings.component';
import { TimersComponent } from '@/app/modules/account/components/timers/timers.component';
import { DividerComponent } from '@/app/modules/layout/components/divider/divider.component';

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
  styleUrl: './index.component.scss',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  public userType!: Signal<string>;
  private settingsStore: Store<SettingsState> = inject<Store<SettingsState>>(Store);

  public ngOnInit(): void {
    this.userType = this.settingsStore.selectSignal(selectUserType);
  }
}
