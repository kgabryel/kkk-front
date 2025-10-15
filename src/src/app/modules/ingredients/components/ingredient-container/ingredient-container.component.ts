import { ChangeDetectionStrategy, Component, input, InputSignal, OnInit } from '@angular/core';

import { Ingredient } from '../../../../core/models/ingredient';
import { IngredientEditComponent } from '../ingredient-edit/ingredient-edit.component';
import { IngredientPreviewComponent } from '../ingredient-preview/ingredient-preview.component';
import { OzaEditComponent } from '../oza-edit/oza-edit.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IngredientEditComponent, IngredientPreviewComponent, OzaEditComponent],
  selector: 'ingredients-ingredient-container',
  standalone: true,
  styleUrls: [],
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
    this.edit = value[0]!;
    this.oza = value[1]!;
  }
}
