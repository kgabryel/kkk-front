import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Recipe} from '../../../../core/models/recipe';
import {MatDialog} from '@angular/material/dialog';
import {AddPhotoDialogComponent} from '../add-photo/add-photo-dialog.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {RecipesService} from '../../../../core/services/recipes/recipes.service';
import {ImagesConfig} from '../../../../config/images.config';
import {BehaviorSubject, Observable} from 'rxjs';
import {PhotosConfig} from '../../../../config/photos.config';
import {photoDelete, photosReorder} from '../../../../core/store/recipes/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/recipes/reducers';
import {PhotoService} from '../../../../core/services/photo/photo.service';
import {Photo, PhotoOrder} from '../../../../core/models/photo';
import {RecipesTooltips, tooltips} from '../../../../core/tooltips/recipes.tooltips';
import {DeleteDialogComponent} from '../../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'recipes-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnChanges {

  @Input() public recipe: Recipe;
  public photos: PhotoOrder[];
  public loadingGif: string;
  public photosPaths: Map<number, BehaviorSubject<string>>;
  public tooltips: RecipesTooltips;
  private dialog: MatDialog;
  private recipesService: RecipesService;
  private store: Store<State>;
  private photoService: PhotoService;

  public constructor(dialog: MatDialog,
    recipesService: RecipesService,
    store: Store<State>,
    photoService: PhotoService) {
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
    this.recipe.photos.forEach(photo => this.recipesService.getPhoto(this.recipe.id, photo.id, PhotosConfig.small)
      .subscribe(response => this.photosPaths.set(
        photo.id,
        new BehaviorSubject(RecipesService.mapPhoto(photo, response))
      )));
  }

  public openDialog(): void {
    this.dialog.open(AddPhotoDialogComponent, {
      width: '800px',
      autoFocus: false,
      data: {recipeId: this.recipe.id}
    });
  }

  public drop(event: CdkDragDrop<PhotoOrder[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.photos, event.previousIndex, event.currentIndex);
    let order = this.photos.map((value, index) => {
      return {
        id: value.value.id,
        index: index + 1
      };
    });
    this.store.dispatch(photosReorder({
      id: this.recipe.id,
      order: order
    }));
  }

  public getPhoto(photo: Photo): Observable<string> | undefined {
    return this.photosPaths.get(photo.id);
  }

  public deletePhoto(id: number): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '800px',
      autoFocus: false,
      data: {
        onClose: () => this.store.dispatch(photoDelete({
          recipeId: this.recipe.id,
          photoId: id
        }))
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.setPhotos();
  }

  public show(photo: Photo): void {
    this.photoService.show(photo);
  }

  private setPhotos(): void {
    this.photos = this.recipe.photos.map(photo => {
      return {
        code: photo.id,
        value: photo
      };
    });
  }
}
