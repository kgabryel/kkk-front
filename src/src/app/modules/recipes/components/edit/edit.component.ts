import type { InputSignal, OnInit } from '@angular/core';

import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';

import type { RecipesFormNames } from '@/app/core/factories/recipe.factory';
import type { Recipe } from '@/app/core/models/recipe';

import { formNames } from '@/app/core/factories/recipe.factory';
import { imports, providers, RecipeFormService } from '@/app/core/services/recipe-form.service';
import { recipeUpdate } from '@/app/core/store/recipes/actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: imports,
  providers: [...providers, RecipeFormService],
  selector: 'recipes-edit',
  styleUrls: ['../form/form.component.scss', './edit.component.scss'],
  templateUrl: '../form/form.component.html',
})
export class EditComponent implements OnInit {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public formNames: RecipesFormNames = formNames;
  public formService: RecipeFormService = inject(RecipeFormService);

  public ngOnInit(): void {
    this.formService.form = this.formService.recipeFormFactory.getEditForm(this.recipe());
    this.formService.recipeModel = this.recipe();
    this.formService.setUp();
  }

  public submit(): void {
    if (this.formService.form.invalid) {
      return;
    }
    this.formService.store.dispatch(recipeUpdate({ id: this.recipe().id, recipe: this.formService.prepareRequest() }));
  }
}
