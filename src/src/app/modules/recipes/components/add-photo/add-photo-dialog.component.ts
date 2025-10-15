import { Component, Inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { takeUntil } from 'rxjs';

import { messages } from '../../../../core/messages/recipes.messages';
import { NotificationService } from '../../../../core/services/notification.service';
import { photoAdd, photoAddError, photoAddSuccess } from '../../../../core/store/recipes/actions';
import { State } from '../../../../core/store/recipes/reducers';
import { BaseComponent } from '../../../base.component';

@Component({
  imports: [
    MatIcon,
    MatDialogClose,
    MatIconButton,
    MatProgressBar,
    MatButton,
    ImageCropperComponent,
  ],
  selector: 'recipes-add-photo-dialog',
  standalone: true,
  styleUrls: ['./add-photo-dialog.component.scss'],
  templateUrl: './add-photo-dialog.component.html',
})
export class AddPhotoDialogComponent extends BaseComponent implements OnInit {
  public croppedImage: string | null | undefined;
  public imageChangedEvent: Event | null;
  public uploading: boolean;
  private dialogRef: MatDialogRef<AddPhotoDialogComponent>;
  private img!: HTMLImageElement;
  private notificationService: NotificationService;
  private readonly recipeId: number;
  private store: Store<State>;
  public constructor(
    @Inject(MAT_DIALOG_DATA) data: AddPhotoDialogInput,
    notificationService: NotificationService,
    store: Store<State>,
    actions$: Actions,
    dialogRef: MatDialogRef<AddPhotoDialogComponent>,
  ) {
    super();
    this.recipeId = data.recipeId;
    this.notificationService = notificationService;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.uploading = false;
    this.store = store;
    this.dialogRef = dialogRef;
    this.onObservable(
      () => this.dialogRef.close(),
      actions$.pipe(ofType(photoAddSuccess), takeUntil(this.dialogRef.afterClosed())),
    );

    this.onObservable(
      () => (this.uploading = false),
      actions$.pipe(ofType(photoAddError), takeUntil(this.dialogRef.afterClosed())),
    );
  }

  public ngOnInit(): void {
    this.img = new Image();
    this.img.onload = (): void => this.check();
  }

  public fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement | null;

    if (!input?.files?.[0]) {
      return;
    }

    this.imageChangedEvent = event;
    this.img.src = URL.createObjectURL(input.files[0]);
  }

  public async imageCropped(event: ImageCroppedEvent): Promise<void> {
    if (event.blob) {
      await this.blobToBase64(event.blob).then((base64: string) => (this.croppedImage = base64));
    }
  }

  public upload(): void {
    this.uploading = true;
    if (this.croppedImage === null || this.croppedImage === undefined) {
      return;
    }
    this.store.dispatch(
      photoAdd({
        id: this.recipeId,
        photo: this.croppedImage,
      }),
    );
  }

  private check(): void {
    if (this.img.width < 800 || this.img.height < 600) {
      this.imageChangedEvent = null;
      this.notificationService.showErrorMessage(
        `${messages.invalidPhotoDimensions} (${this.img.width}×${this.img.height}px). Minimalny rozmiar to 800×600 pikseli.`,
      );
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>(
      (resolve: (value: string) => void, reject: (reason?: unknown) => void) => {
        const reader = new FileReader();
        reader.onloadend = (): void => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      },
    );
  }
}

export interface AddPhotoDialogInput {
  recipeId: number;
}
