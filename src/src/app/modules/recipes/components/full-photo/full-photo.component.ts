import type { OnInit, Signal, WritableSignal } from '@angular/core';

import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { take } from 'rxjs/operators';

import type { Photo } from '@/app/core/models/photo';

import { ImagesConfig } from '@/app/config/images.config';
import { PhotosConfig } from '@/app/config/photos.config';
import { PhotoService } from '@/app/core/services/photo.service';
import { RecipesService } from '@/app/core/services/recipes.service';
import { BaseComponent } from '@/app/modules/base.component';
import { LoaderComponent } from '@/app/modules/shared/components/loader/loader.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderComponent],
  providers: [RecipesService],
  selector: 'recipes-full-photo',
  styleUrl: './full-photo.component.scss',
  templateUrl: './full-photo.component.html',
})
export class FullPhotoComponent extends BaseComponent implements OnInit {
  public loadingGif: string = ImagesConfig.loading;
  public photo!: Signal<Photo | null>;
  public photoData: WritableSignal<string> = signal<string>('');
  public style: WritableSignal<string> = signal<string>('');
  private photoService: PhotoService = inject(PhotoService);
  private recipesService: RecipesService = inject(RecipesService);

  public ngOnInit(): void {
    this.photo = this.photoService.getState();
    this.onSignalValue((photo: Photo | null) => {
      if (photo !== null) {
        this.style.set(`width:100%; height:100%; max-width:${photo?.width}px; max-height:${photo?.height}px;`);
        this.recipesService
          .getPhoto(1, photo.id, PhotosConfig.original)
          .pipe(take(1))
          .subscribe((response: ArrayBuffer) =>
            this.photoData.set('background-image: url(' + RecipesService.mapPhoto(photo, response) + ')'),
          );
      }
    }, this.photo);
  }

  public hide(): void {
    this.photoService.hide();
    this.style.set('');
    this.photoData.set('');
  }
}
