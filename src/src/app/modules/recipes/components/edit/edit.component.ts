import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {recipeUpdate} from '../../../../core/store/recipes/actions';
import {Recipe} from '../../../../core/models/recipe';
import {FormComponent} from '../form/form.component';

@Component({
  selector: 'recipes-edit',
  templateUrl: '../form/form.component.html',
  styleUrls: ['../form/form.component.scss', './edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent extends FormComponent implements OnInit {

  @Input() public recipe: Recipe;

  public ngOnInit(): void {
    this.form = this.recipeFormFactory.getEditForm(this.recipe);
    this.recipeModel = this.recipe;
    this.setUp();
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(recipeUpdate({id: this.recipe.id, recipe: this.prepareRequest()}));
  }
}
