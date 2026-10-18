import type { InputSignal, OnInit, Signal, WritableSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, signal } from '@angular/core';
import { take } from 'rxjs/operators';
import { register } from 'swiper/element/bundle';

import type { Photo } from '@/app/core/models/photo';

import { ImagesConfig } from '@/app/config/images.config';
import { PhotosConfig } from '@/app/config/photos.config';
import { PhotoService } from '@/app/core/services/photo.service';
import { RecipesService } from '@/app/core/services/recipes.service';

register();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'recipes-recipe-photos',
  templateUrl: './recipe-photos.component.html',
})
export class RecipePhotosComponent implements OnInit {
  public loadingGif: string = ImagesConfig.loading;
  public photos: InputSignal<Photo[]> = input.required<Photo[]>();
  public recipeId: InputSignal<number> = input.required<number>();
  private loadedPhotos = new Map<number, WritableSignal<string>>();
  private photoService: PhotoService = inject(PhotoService);
  private recipesService: RecipesService = inject(RecipesService);

  public ngOnInit(): void {
    this.photos().forEach((photo: Photo) => {
      const subject = signal<string>(this.loadingGif);
      this.loadedPhotos.set(photo.id, subject);

      this.recipesService
        .getPhoto(this.recipeId(), photo.id, PhotosConfig.medium)
        .pipe(take(1))
        .subscribe((response: ArrayBuffer) => {
          subject.set(RecipesService.mapPhoto(photo, response));
        });
    });
  }

  public getPhoto(photo: Photo): Signal<string> {
    return this.loadedPhotos.get(photo.id) ?? signal<string>('');
  }

  public showPhoto(photo: Photo): void {
    this.photoService.show(photo);
  }
}
