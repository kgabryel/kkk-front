import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {selectUserType} from '../../../../core/store/settings/selectors';
import {Observable} from 'rxjs';

@Component({
  selector: 'account-pages-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit {
  public userType$: Observable<string>;
  private settingsStore: Store<SettingsState>;

  public constructor(settingsStore: Store<SettingsState>) {
    this.settingsStore = settingsStore;
  }

  public ngOnInit(): void {
    this.userType$ = this.settingsStore.select(selectUserType);
  }
}
