import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiKey} from '../../../../core/models/api-key';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/api-keys/reducers';
import {selectKeys} from '../../../../core/store/api-keys/selectors';

@Component({
  selector: 'account-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeysComponent implements OnInit {
  public key$: Observable<ApiKey[]>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.key$ = this.store.select(selectKeys);
  }
}
