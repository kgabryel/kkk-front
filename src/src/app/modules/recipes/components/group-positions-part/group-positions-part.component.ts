import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {formNames, RecipeFormFactory, RecipesFormNames} from '../../../../core/factories/recipe.factory';
import {RecipeErrors, recipeErrors} from '../../../../core/errors/recipe.error';
import {map, startWith} from 'rxjs/operators';
import {Length} from '../../../../config/form.config';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'recipes-group-positions-part',
  templateUrl: './group-positions-part.component.html',
  styleUrls: ['./group-positions-part.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupPositionsPartComponent implements OnInit, OnDestroy {

  @Input() public formPart: AbstractControl;
  public formGroup: FormGroup;
  public formNames: RecipesFormNames;
  public positions: FormArray;
  public nameLength$: Observable<number>;
  public errors: RecipeErrors;
  public usedIngredients: number[];
  public usedRecipes: number[];
  public maxNameLength: number;
  @Output() private delete: EventEmitter<void>;
  private subscription: Subscription;

  public constructor() {
    this.formNames = formNames;
    this.delete = new EventEmitter<void>();
    this.errors = recipeErrors;
    this.maxNameLength = Length.maxIngredientsGroupNameLength;
  }

  public ngOnInit(): void {
    this.usedIngredients = [];
    this.formGroup = this.formPart as FormGroup;
    this.nameLength$ = (this.formGroup.get(this.formNames.name) as FormControl).valueChanges.pipe(
      startWith(this.formGroup?.get(this.formNames.name)?.value ?? ''),
      map(value => value.length)
    );
    this.positions = this.formGroup.get(this.formNames.positions) as FormArray;
    this.usedIngredients = this.positions.value.filter(
      (position: any) => position.type === 'ingredient').map((position: any) => position.ingredient
    );
    this.usedRecipes = this.positions.value.filter(
      (position: any) => position.type === 'recipe').map((position: any) => position.ingredient
    );
    this.subscription = this.positions.valueChanges.pipe(
      map((positions: any) => positions.map((position: any) => position.ingredient))
    ).subscribe(data => this.usedIngredients = data);
  }

  public addPosition(): void {
    this.positions.push(RecipeFormFactory.getPositionPart());
  }

  public removePosition(index: number): void {
    this.positions.removeAt(index);
  }

  public deleteGroup(): void {
    this.delete.emit();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
