import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { keyAdd } from '../../../../core/store/api-keys/actions';
import { State } from '../../../../core/store/api-keys/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton],
  selector: 'account-generate-key-button',
  standalone: true,
  styleUrls: ['./generate-key-button.component.scss'],
  templateUrl: './generate-key-button.component.html',
})
export class GenerateKeyButtonComponent {
  private store: Store<State>;
  public constructor(store: Store<State>) {
    this.store = store;
  }

  public generate(): void {
    this.store.dispatch(keyAdd());
  }
}
