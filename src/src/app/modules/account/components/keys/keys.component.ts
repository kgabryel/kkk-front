import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { ApiKey } from '@/app/core/models/api-key';
import type { State } from '@/app/core/store/api-keys/reducers';

import { selectKeys } from '@/app/core/store/api-keys/selectors';
import { ApiKeyComponent } from '@/app/modules/account/components/api-key/api-key.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApiKeyComponent],
  selector: 'account-keys',
  styleUrl: './keys.component.scss',
  templateUrl: './keys.component.html',
})
export class KeysComponent implements OnInit {
  public keys!: Signal<ApiKey[]>;
  private store: Store<State> = inject<Store<State>>(Store);

  public ngOnInit(): void {
    this.keys = this.store.selectSignal(selectKeys);
  }
}
