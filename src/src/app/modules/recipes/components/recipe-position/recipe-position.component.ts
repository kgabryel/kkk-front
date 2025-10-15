import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnInit,
  Signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatLine } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../../core/models/recipe';
import { State } from '../../../../core/store/recipes/reducers';
import { selectRecipeAvailable } from '../../../../core/store/recipes/selectors';
import { RecipesTooltips, tooltips } from '../../../../core/tooltips/recipes.tooltips';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { RecipePreviewHrefPipe } from '../../../shared/pipes/recipe-preview-href.pipe';
import { RecipeDialogComponent } from '../recipe-dialog/recipe-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListItem,
    MatIcon,
    MatTooltip,
    MatIconButton,
    MatLine,
    RouterLink,
    RecipePreviewHrefPipe,
  ],
  selector: 'recipes-recipe-position',
  standalone: true,
  styleUrls: ['./recipe-position.component.scss'],
  templateUrl: './recipe-position.component.html',
})
export class RecipePositionComponent implements OnInit {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public measure: InputSignal<string> = input.required<string>();
  public amount: InputSignal<string | null> = input.required<string | null>();
  public additional: InputSignal<boolean> = input.required<boolean>();
  public available!: Signal<boolean>;
  public tooltips: RecipesTooltips;
  private dialog: MatDialog;
  private readonly store: Store<State>;
  public constructor(store: Store<State>, dialog: MatDialog) {
    this.store = store;
    this.dialog = dialog;
    this.tooltips = tooltips;
  }

  public ngOnInit(): void {
    this.available = SignalUtils.map<Recipe, boolean>(this.recipe, (recipe: Recipe) =>
      this.store.selectSignal(selectRecipeAvailable(recipe))(),
    );
  }

  public openDialog(): void {
    this.dialog.open(RecipeDialogComponent, {
      data: { recipe: this.recipe() },
      width: '800px',
    });
  }
}
