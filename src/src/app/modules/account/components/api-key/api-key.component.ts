import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';

import { messages } from '../../../../core/messages/account.messages';
import { ApiKey } from '../../../../core/models/api-key';
import { NotificationService } from '../../../../core/services/notification.service';
import { keyDelete, keyUpdate } from '../../../../core/store/api-keys/actions';
import { State } from '../../../../core/store/api-keys/reducers';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatSlideToggle, MatButton],
  selector: 'account-api-key',
  standalone: true,
  styleUrls: ['./api-key.component.scss'],
  templateUrl: './api-key.component.html',
})
export class ApiKeyComponent {
  public apiKey: InputSignal<ApiKey> = input.required<ApiKey>();
  private clipboard: Clipboard;
  private dialog: MatDialog;
  private notificationService: NotificationService;
  private store: Store<State>;
  public constructor(
    clipboard: Clipboard,
    notificationService: NotificationService,
    store: Store<State>,
    dialog: MatDialog,
  ) {
    this.clipboard = clipboard;
    this.notificationService = notificationService;
    this.store = store;
    this.dialog = dialog;
  }

  public copy(): void {
    this.clipboard.copy(this.apiKey().key);
    this.notificationService.showMessage(messages.keyCopied);
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () => this.store.dispatch(keyDelete({ id: this.apiKey().id })),
      },
      width: '800px',
    });
  }

  public switch(): void {
    this.store.dispatch(
      keyUpdate({
        id: this.apiKey().id,
      }),
    );
  }
}
