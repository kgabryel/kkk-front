import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import type { InputSignal, OnChanges, OnInit, Signal, WritableSignal } from '@angular/core';

import { CdkDrag, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, input, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import type { Photo, PhotoOrder } from '@/app/core/models/photo';
import type { Recipe } from '@/app/core/models/recipe';
import type { State } from '@/app/core/store/recipes/reducers';
import type { RecipesTooltips } from '@/app/core/tooltips/recipes.tooltips';

import { ImagesConfig } from '@/app/config/images.config';
import { PhotosConfig } from '@/app/config/photos.config';
import { PhotoService } from '@/app/core/services/photo.service';
import { RecipesService } from '@/app/core/services/recipes.service';
import { photoDelete, photosReorder } from '@/app/core/store/recipes/actions';
import { tooltips } from '@/app/core/tooltips/recipes.tooltips';
import { AddPhotoDialogComponent } from '@/app/modules/recipes/components/add-photo/add-photo-dialog.component';
import { DeleteDialogComponent } from '@/app/modules/shared/components/delete-dialog/delete-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, CdkDropList, CdkDrag, MatButton, CdkDragHandle, MatTooltip, MatIconButton],
  selector: 'recipes-gallery',
  styleUrl: './gallery.component.scss',
  templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit, OnChanges {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public loadingGif: string = ImagesConfig.loading;
  public photos!: PhotoOrder[];
  public photosPaths: Map<number, WritableSignal<string>>;
  public tooltips: RecipesTooltips = tooltips;
  private dialog: MatDialog = inject(MatDialog);
  private photoService: PhotoService = inject(PhotoService);
  private recipesService: RecipesService = inject(RecipesService);
  private store: Store<State> = inject<Store<State>>(Store);
  public constructor() {
    this.photosPaths = new Map();
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
