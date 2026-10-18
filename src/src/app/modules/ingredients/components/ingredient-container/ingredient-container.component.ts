import type { InputSignal, OnInit } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Ingredient } from '@/app/core/models/ingredient';

import { IngredientEditComponent } from '@/app/modules/ingredients/components/ingredient-edit/ingredient-edit.component';
import { IngredientPreviewComponent } from '@/app/modules/ingredients/components/ingredient-preview/ingredient-preview.component';
import { OzaEditComponent } from '@/app/modules/ingredients/components/oza-edit/oza-edit.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IngredientEditComponent, IngredientPreviewComponent, OzaEditComponent],
  selector: 'ingredients-ingredient-container',
  templateUrl: './ingredient-container.component.html',
})
export class IngredientContainerComponent implements OnInit {
  public ingredient: InputSignal<Ingredient> = input.required<Ingredient>();
  public ozaKey: InputSignal<string | null> = input.required<string | null>();
  public edit!: boolean;
  public oza!: boolean;
  public ngOnInit(): void {
    this.edit = false;
    this.oza = false;
  }

  public changeEdit(value: boolean[]): void {
    const [edit = this.edit, oza = this.oza] = value;
    this.edit = edit;
    this.oza = oza;
  }
}
