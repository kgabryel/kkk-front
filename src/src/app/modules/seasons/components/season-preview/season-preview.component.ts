import type { InputSignal, OnInit, Signal, OutputEmitterRef } from '@angular/core';

import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Month } from '@/app/config/months.config';
import type { Ingredient } from '@/app/core/models/ingredient';
import type { Recipe } from '@/app/core/models/recipe';
import type { Season } from '@/app/core/models/season';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as RecipesState } from '@/app/core/store/recipes/reducers';
import type { State as SeasonsState } from '@/app/core/store/seasons/reducers';

import { months } from '@/app/config/months.config';
import { RoutingConfig } from '@/app/config/routing.config';
import { selectById } from '@/app/core/store/ingredients/selectors';
import { selectRecipesForIngredient } from '@/app/core/store/recipes/selectors';
import { seasonDelete } from '@/app/core/store/seasons/actions';
import { PathUtils } from '@/app/core/utils/path.utils';
import { SignalUtils } from '@/app/core/utils/signal.utils';
import { DeleteDialogComponent } from '@/app/modules/shared/components/delete-dialog/delete-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListItem, MatIcon, MatButton, MatMenuTrigger, MatIconButton, MatMenu, RouterLink, MatMenuItem],
  selector: 'seasons-season-preview',
  styleUrl: './season-preview.component.scss',
  templateUrl: './season-preview.component.html',
})
export class SeasonPreviewComponent implements OnInit {
  public season: InputSignal<Season> = input.required<Season>();
  public edit: OutputEmitterRef<boolean> = output<boolean>();
  public href!: string;
  public ingredient!: Signal<Ingredient>;
  public recipesCount!: Signal<number>;
  public seasonStep: number;
  public startMonth!: string;
  public stopMonth!: string;
  private dialog: MatDialog = inject(MatDialog);
  private ingredientsStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private recipesStore: Store<RecipesState> = inject<Store<RecipesState>>(Store);
  private seasonsStore: Store<SeasonsState> = inject<Store<SeasonsState>>(Store);
  public constructor() {
    this.seasonStep = 0;
  }

  public ngOnInit(): void {
    this.ingredient = this.ingredientsStore.selectSignal(selectById(this.season().ingredientId)) as Signal<Ingredient>;
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
