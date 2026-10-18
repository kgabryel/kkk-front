import type { OnInit } from '@angular/core';
import type { FormArray } from '@angular/forms';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import type { RecipesFormNames } from '@/app/core/factories/recipe.factory';

import { formNames } from '@/app/core/factories/recipe.factory';
import { imports, providers, RecipeFormService } from '@/app/core/services/recipe-form.service';
import { recipeAdd } from '@/app/core/store/recipes/actions';
import { FormUtils } from '@/app/core/utils/form.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: imports,
  providers: [...providers, RecipeFormService],
  selector: 'recipes-create',
  styleUrl: '../form/form.component.scss',
  templateUrl: '../form/form.component.html',
})
export class CreateComponent implements OnInit {
  public formNames: RecipesFormNames = formNames;
  public formService: RecipeFormService = inject(RecipeFormService);

  public ngOnInit(): void {
    this.formService.recipeModel = null;
    this.formService.form = this.formService.recipeFormFactory.getCreateForm();
    this.formService.setUp();
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.formService.descriptionGroup, '', this.formNames.name, this.formNames.description);
    FormUtils.clearInputs(
      this.formService.detailsGroup,
      false,
      this.formNames.favourite,
      this.formNames.public,
      this.formNames.toDo,
    );
    FormUtils.clearInputs(this.formService.detailsGroup, 1, this.formNames.portions);
    FormUtils.clearInputs(this.formService.detailsGroup, '', this.formNames.url);
    this.formService.detailsGroup.get(this.formNames.tagsGroup)?.get(this.formNames.search)?.reset('');
    const tags = this.formService.detailsGroup.get(this.formNames.tagsGroup)?.get(this.formNames.tags) as FormArray;
    tags.clear();

    this.formService.positions.clear();
    this.formService.addPositionsGroup();
  }

  public submit(): void {
    if (this.formService.form.invalid) {
      return;
    }
    this.formService.store.dispatch(
      recipeAdd({
        recipe: this.formService.prepareRequest(),
      }),
    );
    this.clearForm();
  }
}
