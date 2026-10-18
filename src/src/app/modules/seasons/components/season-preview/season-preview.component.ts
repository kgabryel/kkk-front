import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Month, months } from '../../../../config/months.config';
import { RoutingConfig } from '../../../../config/routing.config';
import { Ingredient } from '../../../../core/models/ingredient';
import { Recipe } from '../../../../core/models/recipe';
import { Season } from '../../../../core/models/season';
import { State as IngredientsState } from '../../../../core/store/ingredients/reducers';
import { selectById } from '../../../../core/store/ingredients/selectors';
import { State as RecipesState } from '../../../../core/store/recipes/reducers';
import { selectRecipesForIngredient } from '../../../../core/store/recipes/selectors';
import { seasonDelete } from '../../../../core/store/seasons/actions';
import { State as SeasonsState } from '../../../../core/store/seasons/reducers';
import { PathUtils } from '../../../../core/utils/path.utils';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListItem,
    MatIcon,
    MatButton,
    MatMenuTrigger,
    MatIconButton,
    MatMenu,
    RouterLink,
    MatMenuItem,
  ],
  selector: 'seasons-season-preview',
  standalone: true,
  styleUrls: ['./season-preview.component.scss'],
  templateUrl: './season-preview.component.html',
})
export class SeasonPreviewComponent implements OnInit {
  public season: InputSignal<Season> = input.required<Season>();
  public edit = output<boolean>();
  public href!: string;
  public ingredient!: Signal<Ingredient>;
  public recipesCount!: Signal<number>;
  public seasonStep: number;
  public startMonth!: string;
  public stopMonth!: string;
  private dialog: MatDialog;
  private ingredientsStore: Store<IngredientsState>;
  private recipesStore: Store<RecipesState>;
  private seasonsStore: Store<SeasonsState>;
  public constructor(
    ingredientsStore: Store<IngredientsState>,
    seasonsStore: Store<SeasonsState>,
    recipesStore: Store<RecipesState>,
    dialog: MatDialog,
  ) {
    this.ingredientsStore = ingredientsStore;
    this.seasonsStore = seasonsStore;
    this.seasonStep = 0;
    this.recipesStore = recipesStore;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.ingredient = this.ingredientsStore.selectSignal(
      selectById(this.season().ingredientId),
    ) as Signal<Ingredient>;
    this.startMonth = months.find((month: Month) => month.value == this.season().start)?.key ?? '';
    this.stopMonth = months.find((month: Month) => month.value == this.season().stop)?.key ?? '';
    const currentMonth = new Date().getMonth() + 1;

    if (currentMonth === this.season().start) {
      this.seasonStep = 1;
    }
    if (currentMonth === this.season().stop) {
      this.seasonStep = 3;
    }
    if (currentMonth > this.season().start && currentMonth < this.season().stop) {
      this.seasonStep = 2;
    }
    const ingredient: Ingredient = {
      available: false,
      id: this.season().ingredientId,
      name: '',
      ozaId: null,
    };
    this.recipesCount = SignalUtils.map<Recipe[], number>(
      this.recipesStore.selectSignal(selectRecipesForIngredient(ingredient)),
      (recipes: Recipe[]) => recipes.length,
    );
    this.href = PathUtils.bindParams(
      PathUtils.concatPath(RoutingConfig.ingredients, RoutingConfig.ingredientRecipes),
      new Map([['id', this.season().ingredientId.toString()]]),
    );
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () => this.seasonsStore.dispatch(seasonDelete({ id: this.season().id })),
      },
      width: '800px',
    });
  }

  public startEdit(): void {
    this.edit.emit(true);
  }
}
