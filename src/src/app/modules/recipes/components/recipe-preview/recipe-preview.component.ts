import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../../../../core/models/recipe';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable} from 'rxjs';
import {Tag} from '../../../../core/models/tag';
import {State as TagsState} from '../../../../core/store/tags/reducers';
import {selectTagsForRecipe} from '../../../../core/store/tags/selectors';
import {State as RecipesState} from '../../../../core/store/recipes/reducers';
import {recipeDelete, recipeFavouriteUpdate, recipeToDoUpdate} from '../../../../core/store/recipes/actions';
import {Clipboard} from '@angular/cdk/clipboard';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {environment} from '../../../../../environments/environment';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {Timer} from '../../../../core/models/timer';
import {TimersListService} from '../../../../core/services/timers-list/timers-list.service';
import {messages} from '../../../../core/messages/recipes.messages';
import {RecipesTooltips, tooltips} from '../../../../core/tooltips/recipes.tooltips';
import {PhotosConfig} from '../../../../config/photos.config';
import {ImagesConfig} from '../../../../config/images.config';
import {RecipesService} from '../../../../core/services/recipes/recipes.service';
import {PhotoService} from '../../../../core/services/photo/photo.service';
import {Photo} from '../../../../core/models/photo';
import {MatDialog} from '@angular/material/dialog';
import {DeleteDialogComponent} from '../../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'recipes-recipe-preview',
  templateUrl: './recipe-preview.component.html',
  styleUrls: ['./recipe-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipePreviewComponent implements OnInit {
  @Input() public recipe: Recipe;
  public tags$: Observable<Tag[]>;
  public portions: number;
  @Input() public previewAvailable: boolean;
  @Input() public buttons: boolean;
  public tooltips: RecipesTooltips;
  public photos: Map<number, BehaviorSubject<string>>;
  public loadingGif: string;
  private recipesStore: Store<RecipesState>;
  private tagsStore: Store<TagsState>;
  private clipboard: Clipboard;
  private notificationService: NotificationService;
  private timersListService: TimersListService;
  private recipesService: RecipesService;
  private photoService: PhotoService;
  private activePhoto: number;
  private dialog: MatDialog;

  public constructor(
    recipesStore: Store<RecipesState>,
    tagsStore: Store<TagsState>,
    clipboard: Clipboard,
    notificationService: NotificationService,
    timersListService: TimersListService,
    recipesService: RecipesService,
    photoService: PhotoService,
    dialog: MatDialog
  ) {
    this.recipesStore = recipesStore;
    this.tagsStore = tagsStore;
    this.previewAvailable = true;
    this.buttons = true;
    this.clipboard = clipboard;
    this.notificationService = notificationService;
    this.timersListService = timersListService;
    this.tooltips = tooltips;
    this.photos = new Map();
    this.loadingGif = ImagesConfig.loading;
    this.recipesService = recipesService;
    this.photoService = photoService;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.activePhoto = 0;
    this.tags$ = this.tagsStore.select(selectTagsForRecipe(this.recipe));
    this.portions = this.recipe.portions;
    this.recipe.photos.forEach(photo => this.recipesService.getPhoto(this.recipe.id, photo.id, PhotosConfig.medium)
      .subscribe(response => this.photos.set(photo.id, new BehaviorSubject(RecipesService.mapPhoto(photo, response)))));
  }

  public updateFavourite(): void {
    this.recipesStore.dispatch(recipeFavouriteUpdate({
      id: this.recipe.id,
      favourite: !this.recipe.favourite
    }));
  }

  public updateToDo(): void {
    this.recipesStore.dispatch(recipeToDoUpdate({
      id: this.recipe.id,
      toDo: !this.recipe.toDo
    }));
  }

  public incrementPortion(): void {
    this.portions++;
  }

  public decrementPortion(): void {
    this.portions--;
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '800px',
      autoFocus: false,
      data: {
        onClose: () => this.recipesStore.dispatch(recipeDelete({id: this.recipe.id}))
      }
    });
  }

  public share(): void {
    this.clipboard.copy(environment.frontUrl + PathUtils.bindParams(RoutingConfig.publicRecipe, new Map([
      ['id', this.recipe.publicId]
    ])));
    this.notificationService.showMessage(messages.copied);
  }

  public addAllTimers(): void {
    this.recipe.timers.forEach(timer => this.timersListService.addTimer(timer));
    if (this.recipe.timers.length > 1) {
      this.notificationService.showMessage(messages.timersAdded);
    } else {
      this.notificationService.showMessage(messages.timerAdded);
    }
  }

  public addTimer(timer: Timer): void {
    this.timersListService.addTimer(timer);
    this.notificationService.showMessage(messages.timerAdded);
  }

  public changedPhoto(index: number): void {
    this.activePhoto = index;
  }

  public showPhoto(event: any): void {
    if (event.target.nodeName === 'DIV') {
      this.photoService.show(this.recipe.photos[this.activePhoto]);
    }
  }

  public getPhoto(photo: Photo): Observable<string> | undefined {
    return this.photos.get(photo.id);
  }
}
