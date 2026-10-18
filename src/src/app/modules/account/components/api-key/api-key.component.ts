import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ApiKey} from '../../../../core/models/api-key';
import {Clipboard} from '@angular/cdk/clipboard';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/api-keys/reducers';
import {keyDelete, keyUpdate} from '../../../../core/store/api-keys/actions';
import {messages} from '../../../../core/messages/account.messages';
import {DeleteDialogComponent} from '../../../shared/components/delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'account-api-key',
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiKeyComponent {

  @Input() public apiKey: ApiKey;
  private clipboard: Clipboard;
  private notificationService: NotificationService;
  private store: Store<State>;
  private dialog: MatDialog;

  public constructor(
    clipboard: Clipboard,
    notificationService: NotificationService,
    store: Store<State>,
    dialog: MatDialog
  ) {
    this.clipboard = clipboard;
    this.notificationService = notificationService;
    this.store = store;
    this.dialog = dialog;
  }

  public switch(): void {
    this.store.dispatch(keyUpdate({
      id: this.apiKey.id
    }));
  }

  public copy(): void {
    this.clipboard.copy(this.apiKey.key);
    this.notificationService.showMessage(messages.keyCopied);
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '800px',
      autoFocus: false,
      data: {
        onClose: () => this.store.dispatch(keyDelete({id: this.apiKey.id}))
      }
    });
  }
}
