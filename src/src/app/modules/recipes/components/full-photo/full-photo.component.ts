import { Component, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { take } from 'rxjs/operators';

import { ImagesConfig } from '../../../../config/images.config';
import { PhotosConfig } from '../../../../config/photos.config';
import { Photo } from '../../../../core/models/photo';
import { PhotoService } from '../../../../core/services/photo.service';
import { RecipesService } from '../../../../core/services/recipes.service';
import { BaseComponent } from '../../../base.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  imports: [LoaderComponent],
  providers: [RecipesService],
  selector: 'recipes-full-photo',
  standalone: true,
  styleUrls: ['./full-photo.component.scss'],
  templateUrl: './full-photo.component.html',
})
export class FullPhotoComponent extends BaseComponent implements OnInit {
  public loadingGif: string;
  public photo!: Signal<Photo | null>;
  public photoData: WritableSignal<string> = signal<string>('');
  public style: WritableSignal<string> = signal<string>('');
  private photoService: PhotoService;
  private recipesService: RecipesService;
  public constructor(photoService: PhotoService, recipesService: RecipesService) {
    super();
    this.photoService = photoService;
    this.loadingGif = ImagesConfig.loading;
    this.recipesService = recipesService;
  }

  public ngOnInit(): void {
    this.photo = this.photoService.getState();
    this.onSignalValue((photo: Photo | null) => {
      if (photo !== null) {
        this.style.set(
          `width:100%; height:100%; max-width:${photo?.width}px; max-height:${photo?.height}px;`,
        );
        this.recipesService
          .getPhoto(1, photo.id, PhotosConfig.original)
          .pipe(take(1))
          .subscribe((response: ArrayBuffer) =>
            this.photoData.set(
              'background-image: url(' + RecipesService.mapPhoto(photo, response) + ')',
            ),
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
