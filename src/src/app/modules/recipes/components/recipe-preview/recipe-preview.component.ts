import { Clipboard } from '@angular/cdk/clipboard';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  InputSignal,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatList } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { register } from 'swiper/element/bundle';

import { environment } from '../../../../../environments/environment';
import { ImagesConfig } from '../../../../config/images.config';
import { PhotosConfig } from '../../../../config/photos.config';
import { RoutingConfig } from '../../../../config/routing.config';
import { messages } from '../../../../core/messages/recipes.messages';
import { Photo } from '../../../../core/models/photo';
import { Recipe } from '../../../../core/models/recipe';
import { Tag } from '../../../../core/models/tag';
import { Timer } from '../../../../core/models/timer';
import { NotificationService } from '../../../../core/services/notification.service';
import { PhotoService } from '../../../../core/services/photo.service';
import { RecipesService } from '../../../../core/services/recipes.service';
import { TimersListService } from '../../../../core/services/timers-list.service';
import {
  recipeDelete,
  recipeFavouriteUpdate,
  recipeToDoUpdate,
} from '../../../../core/store/recipes/actions';
import { State as RecipesState } from '../../../../core/store/recipes/reducers';
import { State as TagsState } from '../../../../core/store/tags/reducers';
import { selectTagsForRecipe } from '../../../../core/store/tags/selectors';
import { RecipesTooltips, tooltips } from '../../../../core/tooltips/recipes.tooltips';
import { PathUtils } from '../../../../core/utils/path.utils';
import { BaseComponent } from '../../../base.component';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { CalculateAmountPipe } from '../../../shared/pipes/calculate-amount.pipe';
import { EmptyStringPipe } from '../../../shared/pipes/empty-string.pipe';
import { FindIngredientPipe } from '../../../shared/pipes/find-ingredient.pipe';
import { FindRecipePipe } from '../../../shared/pipes/find-recipe.pipe';
import { RecipeEditHrefPipe } from '../../../shared/pipes/recipe-edit-href.pipe';
import { RecipePreviewHrefPipe } from '../../../shared/pipes/recipe-preview-href.pipe';
import { TagRecipesHrefPipe } from '../../../shared/pipes/tag-recipes-href.pipe';
import { IngredientPositionComponent } from '../ingredient-position/ingredient-position.component';
import { RecipePositionComponent } from '../recipe-position/recipe-position.component';
import { TimerComponent } from '../timer/timer.component';

register();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    EmptyStringPipe,
    MatButton,
    MatTooltip,
    MatIconButton,
    MatIcon,
    RouterLink,
    RecipePreviewHrefPipe,
    RecipeEditHrefPipe,
    TimerComponent,
    TagRecipesHrefPipe,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatList,
    IngredientPositionComponent,
    CalculateAmountPipe,
    FindIngredientPipe,
    RecipePositionComponent,
    FindRecipePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'recipes-recipe-preview',
  standalone: true,
  styleUrls: ['./recipe-preview.component.scss'],
  templateUrl: './recipe-preview.component.html',
})
export class RecipePreviewComponent extends BaseComponent implements OnInit {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public buttons: InputSignal<boolean> = input<boolean>(true);
  public loadingGif: string;
  public photos: Map<number, WritableSignal<string>>;
  public portions!: number;
  public previewAvailable: InputSignal<boolean> = input<boolean>(true);
  public tags!: Signal<Tag[]>;
  public tooltips: RecipesTooltips;
  private clipboard: Clipboard;
  private dialog: MatDialog;
  private notificationService: NotificationService;
  private photoService: PhotoService;
  private recipesService: RecipesService;
  private recipesStore: Store<RecipesState>;
  private tagsStore: Store<TagsState>;
  private timersListService: TimersListService;
  public constructor(
    recipesStore: Store<RecipesState>,
    tagsStore: Store<TagsState>,
    clipboard: Clipboard,
    notificationService: NotificationService,
    timersListService: TimersListService,
    recipesService: RecipesService,
    photoService: PhotoService,
    dialog: MatDialog,
  ) {
    super();
    this.recipesStore = recipesStore;
    this.tagsStore = tagsStore;
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
    this.tags = this.tagsStore.selectSignal(selectTagsForRecipe(this.recipe()));
    this.portions = this.recipe().portions;
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

  public addAllTimers(): void {
    this.recipe().timers.forEach((timer: Timer) => this.timersListService.addTimer(timer));
    if (this.recipe().timers.length > 1) {
      this.notificationService.showMessage(messages.timersAdded);
    } else {
      this.notificationService.showMessage(messages.timerAdded);
    }
  }

  public addTimer(timer: Timer): void {
    this.timersListService.addTimer(timer);
    this.notificationService.showMessage(messages.timerAdded);
  }

  public decrementPortion(): void {
    this.portions--;
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () => this.recipesStore.dispatch(recipeDelete({ id: this.recipe().id })),
      },
      width: '800px',
    });
  }

  public getPhoto(photo: Photo): Signal<string> {
    return this.photos.get(photo.id) ?? signal<string>('');
  }

  public incrementPortion(): void {
    this.portions++;
  }

  public share(): void {
    this.clipboard.copy(
      environment.frontUrl +
        PathUtils.bindParams(RoutingConfig.publicRecipe, new Map([['id', this.recipe().publicId]])),
    );
    this.notificationService.showMessage(messages.copied);
  }

  public showPhoto(photo: Photo): void {
    this.photoService.show(photo);
  }

  public updateFavourite(): void {
    this.recipesStore.dispatch(
      recipeFavouriteUpdate({
        favourite: !this.recipe().favourite,
        id: this.recipe().id,
      }),
    );
  }

  public updateToDo(): void {
    this.recipesStore.dispatch(
      recipeToDoUpdate({
        id: this.recipe().id,
        toDo: !this.recipe().toDo,
      }),
    );
  }
}
