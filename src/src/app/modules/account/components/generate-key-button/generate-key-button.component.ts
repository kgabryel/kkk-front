import {ChangeDetectionStrategy, Component} from '@angular/core';
import {keyAdd} from '../../../../core/store/api-keys/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/api-keys/reducers';

@Component({
  selector: 'account-generate-key-button',
  templateUrl: './generate-key-button.component.html',
  styleUrls: ['./generate-key-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
