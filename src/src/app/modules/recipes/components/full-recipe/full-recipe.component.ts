import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  InputSignal,
  input,
  WritableSignal,
  signal,
  Signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatLine } from '@angular/material/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatList, MatListItem } from '@angular/material/list';
import { take } from 'rxjs/operators';
import { register } from 'swiper/element/bundle';

import { ImagesConfig } from '../../../../config/images.config';
import { PhotosConfig } from '../../../../config/photos.config';
import { FullRecipe } from '../../../../core/models/full-recipe';
import { Photo } from '../../../../core/models/photo';
import { PhotoService } from '../../../../core/services/photo.service';
import { RecipesService } from '../../../../core/services/recipes.service';
import { EmptyStringPipe } from '../../../shared/pipes/empty-string.pipe';

register();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EmptyStringPipe,
    MatButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatList,
    MatListItem,
    MatLine,
  ],
  providers: [RecipesService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'recipes-full-recipe',
  standalone: true,
  styleUrls: ['./full-recipe.component.scss'],
  templateUrl: './full-recipe.component.html',
})
export class FullRecipeComponent implements OnInit {
  public recipe: InputSignal<FullRecipe> = input.required<FullRecipe>();
  public loadingGif: string;
  public photos: Map<number, WritableSignal<string>>;
  private photoService: PhotoService;
  private recipesService: RecipesService;
  public constructor(photoService: PhotoService, recipesService: RecipesService) {
    this.photoService = photoService;
    this.loadingGif = ImagesConfig.loading;
    this.photos = new Map();
    this.recipesService = recipesService;
  }

  public ngOnInit(): void {
    this.recipe().photos.forEach((photo: Photo) => {
      const subject = signal<string>(this.loadingGif);
      this.photos.set(photo.id, subject);

      this.recipesService
        .getPhoto(this.recipe().id, photo.id, PhotosConfig.medium)
        .pipe(take(1))
        .subscribe((response: ArrayBuffer) => {
          subject.set(RecipesService.mapPhoto(photo, response));
        });
    });
  }

  public getPhoto(photo: Photo): Signal<string> {
    return this.photos.get(photo.id) ?? signal<string>('');
  }

  public showPhoto(photo: Photo): void {
    this.photoService.show(photo);
  }
}
