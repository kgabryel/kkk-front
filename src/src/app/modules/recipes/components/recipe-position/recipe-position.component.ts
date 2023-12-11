import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../../../../core/models/recipe';
import {Observable} from 'rxjs';
import {State} from '../../../../core/store/recipes/reducers';
import {Store} from '@ngrx/store';
import {switchMap} from 'rxjs/operators';
import {selectRecipeAvailable} from '../../../../core/store/recipes/selectors';
import {MatDialog} from '@angular/material/dialog';
import {RecipeDialogComponent} from '../recipe-dialog/recipe-dialog.component';
import {RecipesTooltips, tooltips} from '../../../../core/tooltips/recipes.tooltips';

@Component({
  selector: 'recipes-recipe-position',
  templateUrl: './recipe-position.component.html',
  styleUrls: ['./recipe-position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipePositionComponent implements OnInit {
  @Input() public recipe$: Observable<Recipe | undefined>;
  @Input() public measure: string;
  @Input() public amount: string | null;
  @Input() public additional: boolean;
  public available$: Observable<boolean>;
  public tooltips: RecipesTooltips;
  private readonly store: Store<State>;
  private dialog: MatDialog;

  public constructor(store: Store<State>, dialog: MatDialog) {
    this.store = store;
    this.dialog = dialog;
    this.tooltips = tooltips;
  }

  public ngOnInit(): void {
    this.available$ = this.recipe$.pipe(switchMap(recipe => this.store.select(selectRecipeAvailable(recipe))));
  }

  public openDialog(): void {
    this.dialog.open(RecipeDialogComponent, {
      width: '800px',
      data: {recipe: this.recipe$}
    });
  }
}
