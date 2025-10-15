import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';

import { formNames, RecipesFormNames } from '../../../../core/factories/recipe.factory';
import {
  imports,
  providers,
  RecipeFormService,
} from '../../../../core/services/recipe-form.service';
import { recipeAdd } from '../../../../core/store/recipes/actions';
import { FormUtils } from '../../../../core/utils/form.utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: imports,
  providers: [...providers, RecipeFormService],
  selector: 'recipes-create',
  standalone: true,
  styleUrls: ['../form/form.component.scss'],
  templateUrl: '../form/form.component.html',
})
export class CreateComponent implements OnInit {
  public formNames: RecipesFormNames;
  public formService: RecipeFormService;
  public constructor(formService: RecipeFormService) {
    this.formService = formService;
    this.formNames = formNames;
  }

  public ngOnInit(): void {
    this.formService.recipeModel = null;
    this.formService.form = this.formService.recipeFormFactory.getCreateForm();
    this.formService.setUp();
  }

  public clearForm(): void {
    FormUtils.clearInputs(
      this.formService.descriptionGroup,
      '',
      this.formNames.name,
      this.formNames.description,
    );
    FormUtils.clearInputs(
      this.formService.detailsGroup,
      false,
      this.formNames.favourite,
      this.formNames.public,
      this.formNames.toDo,
    );
    FormUtils.clearInputs(this.formService.detailsGroup, 1, this.formNames.portions);
    FormUtils.clearInputs(this.formService.detailsGroup, '', this.formNames.url);
    this.formService.detailsGroup
      .get(this.formNames.tagsGroup)
      ?.get(this.formNames.search)
      ?.reset('');
    const tags = this.formService.detailsGroup
      .get(this.formNames.tagsGroup)
      ?.get(this.formNames.tags) as FormArray;
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
