import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { ApiKey } from '../../../../core/models/api-key';
import { State } from '../../../../core/store/api-keys/reducers';
import { selectKeys } from '../../../../core/store/api-keys/selectors';
import { ApiKeyComponent } from '../api-key/api-key.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApiKeyComponent],
  selector: 'account-keys',
  standalone: true,
  styleUrls: ['./keys.component.scss'],
  templateUrl: './keys.component.html',
})
export class KeysComponent implements OnInit {
  public keys!: Signal<ApiKey[]>;
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.keys = this.store.selectSignal(selectKeys);
  }
}
