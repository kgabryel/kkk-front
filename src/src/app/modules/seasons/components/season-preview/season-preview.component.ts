import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {Season} from '../../../../core/models/season';
import {Observable, Subscription} from 'rxjs';
import {Ingredient} from '../../../../core/models/ingredient';
import {selectById} from '../../../../core/store/ingredients/selectors';
import {months} from '../../../../config/months.config';
import {seasonDelete} from '../../../../core/store/seasons/actions';
import {State as SeasonsState} from '../../../../core/store/seasons/reducers';
import {State as RecipesState} from '../../../../core/store/recipes/reducers';
import {selectRecipesForIngredient} from '../../../../core/store/recipes/selectors';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {DeleteDialogComponent} from '../../../shared/components/delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'seasons-season-preview',
  templateUrl: './season-preview.component.html',
  styleUrls: ['./season-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonPreviewComponent implements OnInit, OnDestroy {

  @Input() public season: Season;
  public ingredient$: Observable<Ingredient | undefined>;
  public startMonth: string;
  public stopMonth: string;
  public seasonStep: number;
  public recipesCount: number;
  public href: string;
  @Output() private edit: EventEmitter<boolean>;
  private ingredientsStore: Store<IngredientsState>;
  private seasonsStore: Store<SeasonsState>;
  private recipesStore: Store<RecipesState>;
  private subscription: Subscription;
  private dialog: MatDialog;

  public constructor(
    ingredientsStore: Store<IngredientsState>,
    seasonsStore: Store<SeasonsState>,
    recipesStore: Store<RecipesState>,
    dialog: MatDialog
  ) {
    this.edit = new EventEmitter();
    this.ingredientsStore = ingredientsStore;
    this.seasonsStore = seasonsStore;
    this.seasonStep = 0;
    this.recipesStore = recipesStore;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.ingredient$ = this.ingredientsStore.select(selectById(this.season.ingredientId));
    this.startMonth = months.find(month => month.value == this.season.start)?.key ?? '';
    this.stopMonth = months.find(month => month.value == this.season.stop)?.key ?? '';
    const currentMonth = (new Date()).getMonth() + 1;
    if (currentMonth === this.season.start) {
      this.seasonStep = 1;
    }
    if (currentMonth === this.season.stop) {
      this.seasonStep = 3;
    }
    if (currentMonth > this.season.start && currentMonth < this.season.stop) {
      this.seasonStep = 2;
    }
    const ingredient: Ingredient = {
      id: this.season.ingredientId,
      name: '',
      available: false,
      ozaId: null
    };
    this.subscription = this.recipesStore.select(selectRecipesForIngredient(ingredient))
      .subscribe(recipes => this.recipesCount = recipes.length);
    this.href = PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.ingredients, RoutingConfig.ingredientRecipes),
      new Map([['id', this.season.ingredientId.toString()]])
    );
  }

  public startEdit(): void {
    this.edit.emit(true);
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '800px',
      autoFocus: false,
      data: {
        onClose: () => this.seasonsStore.dispatch(seasonDelete({id: this.season.id}))
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
