import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'shared-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {

  private dialogRef: MatDialogRef<DeleteDialogComponent>;
  private readonly onClose: Function;

  public constructor(dialogRef: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.dialogRef = dialogRef;
    this.onClose = data.onClose;
  }

  public close(): void {
    this.onClose();
    this.dialogRef.close();
  }
}
