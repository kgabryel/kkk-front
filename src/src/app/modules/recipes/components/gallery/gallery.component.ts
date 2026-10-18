import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  Component,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { ImagesConfig } from '../../../../config/images.config';
import { PhotosConfig } from '../../../../config/photos.config';
import { Photo, PhotoOrder } from '../../../../core/models/photo';
import { Recipe } from '../../../../core/models/recipe';
import { PhotoService } from '../../../../core/services/photo.service';
import { RecipesService } from '../../../../core/services/recipes.service';
import { photoDelete, photosReorder } from '../../../../core/store/recipes/actions';
import { State } from '../../../../core/store/recipes/reducers';
import { RecipesTooltips, tooltips } from '../../../../core/tooltips/recipes.tooltips';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { AddPhotoDialogComponent } from '../add-photo/add-photo-dialog.component';

@Component({
  imports: [MatIcon, CdkDropList, CdkDrag, MatButton, CdkDragHandle, MatTooltip, MatIconButton],
  selector: 'recipes-gallery',
  standalone: true,
  styleUrls: ['./gallery.component.scss'],
  templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit, OnChanges {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public loadingGif: string;
  public photos!: PhotoOrder[];
  public photosPaths: Map<number, WritableSignal<string>>;
  public tooltips: RecipesTooltips;
  private dialog: MatDialog;
  private photoService: PhotoService;
  private recipesService: RecipesService;
  private store: Store<State>;
  public constructor(
    dialog: MatDialog,
    recipesService: RecipesService,
    store: Store<State>,
    photoService: PhotoService,
  ) {
    this.dialog = dialog;
    this.photosPaths = new Map();
    this.loadingGif = ImagesConfig.loading;
    this.recipesService = recipesService;
    this.store = store;
    this.photoService = photoService;
    this.tooltips = tooltips;
  }

  public ngOnInit(): void {
    this.setPhotos();
  }

  public ngOnChanges(): void {
    this.setPhotos();
  }

  public deletePhoto(id: number): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () =>
          this.store.dispatch(
            photoDelete({
              photoId: id,
              recipeId: this.recipe().id,
            }),
          ),
      },
      width: '800px',
    });
  }

  public drop(event: CdkDragDrop<PhotoOrder[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.photos, event.previousIndex, event.currentIndex);
    const order = this.photos.map((value: PhotoOrder, index: number) => {
      return {
        id: value.value.id,
        index: index + 1,
      };
    });
    this.store.dispatch(
      photosReorder({
        id: this.recipe().id,
        order: order,
      }),
    );
  }

  public getPhoto(photo: Photo): Signal<string> {
    return this.photosPaths.get(photo.id) ?? signal<string>('');
  }

  public openDialog(): void {
    this.dialog.open(AddPhotoDialogComponent, {
      autoFocus: false,
      data: { recipeId: this.recipe().id },
      width: '800px',
    });
  }

  public show(photo: Photo): void {
    this.photoService.show(photo);
  }

  private setPhotos(): void {
    this.photos = this.recipe().photos.map((photo: Photo) => {
      return {
        code: photo.id,
        value: photo,
      };
    });
    this.recipe().photos.forEach((photo: Photo) => {
      if (!this.photosPaths.has(photo.id)) {
        const subject = signal<string>(this.loadingGif);
        this.photosPaths.set(photo.id, subject);

        this.recipesService
          .getPhoto(this.recipe().id, photo.id, PhotosConfig.small)
          .pipe(take(1))
          .subscribe((response: ArrayBuffer) => {
            subject.set(RecipesService.mapPhoto(photo, response));
          });
      }
    });
  }
}
