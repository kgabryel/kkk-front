import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'recipes-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDialogComponent {

  public recipe$: Observable<Recipe>;

  public constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.recipe$ = data.recipe;
  }
}
