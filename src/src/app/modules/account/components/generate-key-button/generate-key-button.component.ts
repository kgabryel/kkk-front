import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import type { State } from '@/app/core/store/api-keys/reducers';

import { keyAdd } from '@/app/core/store/api-keys/actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton],
  selector: 'account-generate-key-button',
  styleUrl: './generate-key-button.component.scss',
  templateUrl: './generate-key-button.component.html',
})
export class GenerateKeyButtonComponent {
  private store: Store<State> = inject<Store<State>>(Store);

  public generate(): void {
    this.store.dispatch(keyAdd());
  }
}
