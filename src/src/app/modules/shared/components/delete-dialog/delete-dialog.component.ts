import { Component, Inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [MatDialogClose, MatIcon, MatIconButton, MatButton],
  selector: 'shared-delete-dialog',
  standalone: true,
  styleUrls: ['./delete-dialog.component.scss'],
  templateUrl: './delete-dialog.component.html',
})
export class DeleteDialogComponent {
  private dialogRef: MatDialogRef<DeleteDialogComponent>;
  private readonly onClose: () => void;
  public constructor(
    dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: DeleteDialogInput,
  ) {
    this.dialogRef = dialogRef;
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
