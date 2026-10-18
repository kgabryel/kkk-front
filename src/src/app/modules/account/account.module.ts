import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {AccountRoutingModule} from './account-routing.module';
import {LogoutBtnComponent} from './components/logout-btn/logout-btn.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SettingsComponent} from './components/settings/settings.component';
import {KeysComponent} from './components/keys/keys.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {GenerateKeyButtonComponent} from './components/generate-key-button/generate-key-button.component';
import {StoreModule} from '@ngrx/store';
import {API_KEYS_KEY, apiKeysReducer} from '../../core/store/api-keys/reducers';
import {EffectsModule} from '@ngrx/effects';
import {ApiKeysEffects} from '../../core/store/api-keys/effects';
import {ApiKeysResolver} from '../../core/resolvers/api-keys.resolver';
import {ApiKeyComponent} from './components/api-key/api-key.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {TimersComponent} from './components/timers/timers.component';
import {TimerAddComponent} from './components/timer-add/timer-add.component';
import {TimerEditComponent} from './components/timer-edit/timer-edit.component';
import {TimersModule} from '../timers/timers.module';
import {ChangePasswordComponent} from './components/change-password/change-password.component';


@NgModule({
  declarations: [
    IndexComponent,
    LogoutBtnComponent,
    SettingsComponent,
    KeysComponent,
    GenerateKeyButtonComponent,
    ApiKeyComponent,
    TimersComponent,
    TimerAddComponent,
    TimerEditComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    StoreModule.forFeature(API_KEYS_KEY, apiKeysReducer),
    EffectsModule.forFeature([ApiKeysEffects]),
    ReactiveFormsModule,
    SharedModule,
    TimersModule
  ],
  providers: [
    ApiKeysResolver
  ]
})
export class AccountModule {
}
