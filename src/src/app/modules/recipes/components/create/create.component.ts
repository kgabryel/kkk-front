import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray} from '@angular/forms';
import {recipeAdd} from '../../../../core/store/recipes/actions';
import {FormComponent} from '../form/form.component';
import {FormUtils} from '../../../../core/utils/form.utils';

@Component({
  selector: 'recipes-create',
  templateUrl: '../form/form.component.html',
  styleUrls: ['../form/form.component.scss', './create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent extends FormComponent implements OnInit {

  public ngOnInit(): void {
    this.recipeModel = null;
    this.form = this.recipeFormFactory.getCreateForm();
    this.setUp();
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(recipeAdd({
      recipe: this.prepareRequest()
    }));
    this.clearForm();
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.descriptionGroup, '', this.formNames.name, this.formNames.description);
    FormUtils.clearInputs(
      this.detailsGroup,
      false,
      this.formNames.favourite,
      this.formNames.public,
      this.formNames.toDo
    );
    FormUtils.clearInputs(this.detailsGroup, 1, this.formNames.portions);
    FormUtils.clearInputs(this.detailsGroup, '', this.formNames.url);
    this.detailsGroup.get(this.formNames.tagsGroup)?.get(this.formNames.search)?.reset('');
    const tags = this.detailsGroup.get(this.formNames.tagsGroup)?.get(this.formNames.tags) as FormArray;
    tags.clear();

    this.positions.clear();
    this.addPositionsGroup();
  }
}
