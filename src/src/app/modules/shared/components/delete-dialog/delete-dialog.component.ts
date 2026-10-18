import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogClose, MatIcon, MatIconButton, MatButton],
  selector: 'shared-delete-dialog',
  styleUrl: './delete-dialog.component.scss',
  templateUrl: './delete-dialog.component.html',
})
export class DeleteDialogComponent {
  private dialogRef: MatDialogRef<DeleteDialogComponent> = inject<MatDialogRef<DeleteDialogComponent>>(MatDialogRef);
  private readonly onClose: () => void;
  public constructor() {
    const data = inject<DeleteDialogInput>(MAT_DIALOG_DATA);

    this.onClose = data.onClose;
  }

  public close(): void {
    this.onClose();
    this.dialogRef.close();
  }
}

export interface DeleteDialogInput {
  onClose: () => void;
}
