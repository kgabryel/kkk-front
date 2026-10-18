import {Component, OnInit} from '@angular/core';
import {Photo} from '../../../../core/models/photo';
import {ImagesConfig} from '../../../../config/images.config';
import {BehaviorSubject, Observable} from 'rxjs';
import {PhotoService} from '../../../../core/services/photo/photo.service';
import {PhotosConfig} from '../../../../config/photos.config';
import {RecipesService} from '../../../../core/services/recipes/recipes.service';

@Component({
  selector: 'recipes-full-photo',
  templateUrl: './full-photo.component.html',
  styleUrls: ['./full-photo.component.scss']
})
export class FullPhotoComponent implements OnInit {

  public photo$: Observable<Photo | null>;
  public loadingGif: string;
  public style$: BehaviorSubject<string>;
  public photoData$: BehaviorSubject<string>;
  private photoService: PhotoService;
  private recipesService: RecipesService;

  public constructor(photoService: PhotoService, recipesService: RecipesService) {
    this.photoService = photoService;
    this.loadingGif = ImagesConfig.loading;
    this.photoData$ = new BehaviorSubject<string>('');
    this.style$ = new BehaviorSubject<string>('');
    this.recipesService = recipesService;
  }

  public ngOnInit(): void {
    this.photo$ = this.photoService.getState();
    this.photo$.subscribe(photo => {
      if (photo !== null) {
        this.style$.next(`width:100%; height:100%; max-width:${photo?.width}px; max-height:${photo?.height}px;`);
        this.recipesService.getPhoto(1, photo.id, PhotosConfig.original)
          .subscribe(response => this.photoData$.next('background-image: url(' + RecipesService.mapPhoto(photo, response) + ')'));
      }
    });
  }

  public hide(): void {
    this.photoService.hide();
    this.style$.next('');
    this.photoData$.next('');
  }
}
