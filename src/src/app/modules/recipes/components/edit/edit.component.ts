import { ChangeDetectionStrategy, Component, input, InputSignal, OnInit } from '@angular/core';

import { formNames, RecipesFormNames } from '../../../../core/factories/recipe.factory';
import { Recipe } from '../../../../core/models/recipe';
import {
  imports,
  providers,
  RecipeFormService,
} from '../../../../core/services/recipe-form.service';
import { recipeUpdate } from '../../../../core/store/recipes/actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: imports,
  providers: [...providers, RecipeFormService],
  selector: 'recipes-edit',
  standalone: true,
  styleUrls: ['../form/form.component.scss', './edit.component.scss'],
  templateUrl: '../form/form.component.html',
})
export class EditComponent implements OnInit {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public formNames: RecipesFormNames;
  public formService: RecipeFormService;
  public constructor(formService: RecipeFormService) {
    this.formService = formService;
    this.formNames = formNames;
  }

  public ngOnInit(): void {
    this.formService.form = this.formService.recipeFormFactory.getEditForm(this.recipe());
    this.formService.recipeModel = this.recipe();
    this.formService.setUp();
  }

  public submit(): void {
    if (this.formService.form.invalid) {
      return;
    }
    this.formService.store.dispatch(
      recipeUpdate({ id: this.recipe().id, recipe: this.formService.prepareRequest() }),
    );
  }
}
