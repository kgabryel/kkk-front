import {Component, Inject, OnInit} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {messages} from '../../../../core/messages/recipes.messages';
import {photoAdd, photoAddError, photoAddSuccess} from '../../../../core/store/recipes/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/recipes/reducers';
import {Actions, ofType} from '@ngrx/effects';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'recipes-add-photo-dialog',
  templateUrl: './add-photo-dialog.component.html',
  styleUrls: ['./add-photo-dialog.component.scss']
})
export class AddPhotoDialogComponent implements OnInit {

  public imageChangedEvent: any;
  public croppedImage: string | null | undefined;
  public uploading: boolean;
  private img: HTMLImageElement;
  private notificationService: NotificationService;
  private store: Store<State>;
  private actions$: Actions;
  private readonly recipeId: number;
  private dialogRef: MatDialogRef<AddPhotoDialogComponent>;

  public constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    notificationService: NotificationService,
    store: Store<State>,
    actions$: Actions,
    dialogRef: MatDialogRef<AddPhotoDialogComponent>
  ) {
    this.recipeId = data.recipeId;
    this.notificationService = notificationService;
    this.imageChangedEvent = '';
    this.croppedImage = null;
    this.uploading = false;
    this.store = store;
    this.actions$ = actions$;
    this.dialogRef = dialogRef;
    this.actions$.pipe(ofType(photoAddSuccess)).subscribe(() => this.dialogRef.close());
    this.actions$.pipe(ofType(photoAddError)).subscribe(() => this.uploading = false);

  }

  public ngOnInit(): void {
    this.img = new Image();
    this.img.onload = () => this.check();
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    const {files} = event.target;
    if (files && files[0]) {
      this.img.src = URL.createObjectURL(files[0]);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  public upload(): void {
    this.uploading = true;
    if (this.croppedImage === null || this.croppedImage === undefined) {
      return;
    }
    this.store.dispatch(photoAdd({
      id: this.recipeId,
      photo: this.croppedImage
    }));
  }

  private check(): void {
    if (this.img.width < 600 || this.img.height < 800) {
      this.imageChangedEvent = '';
      this.notificationService.showErrorMessage(messages.invalidPhotoDimensions);
    }
  }
}
