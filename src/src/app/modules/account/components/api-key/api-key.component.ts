import type { InputSignal } from '@angular/core';

import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';

import type { ApiKey } from '@/app/core/models/api-key';
import type { State } from '@/app/core/store/api-keys/reducers';

import { messages } from '@/app/core/messages/account.messages';
import { NotificationService } from '@/app/core/services/notification.service';
import { keyDelete, keyUpdate } from '@/app/core/store/api-keys/actions';
import { DeleteDialogComponent } from '@/app/modules/shared/components/delete-dialog/delete-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatSlideToggle, MatButton],
  selector: 'account-api-key',
  styleUrl: './api-key.component.scss',
  templateUrl: './api-key.component.html',
})
export class ApiKeyComponent {
  public apiKey: InputSignal<ApiKey> = input.required<ApiKey>();
  private clipboard: Clipboard = inject(Clipboard);
  private dialog: MatDialog = inject(MatDialog);
  private notificationService: NotificationService = inject(NotificationService);
  private store: Store<State> = inject<Store<State>>(Store);

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
