import type { InputSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatLine } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';

import type { Ingredient } from '@/app/core/models/ingredient';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListItem, MatLine, MatIcon],
  selector: 'recipes-ingredient-position',
  styleUrl: './ingredient-position.component.scss',
  templateUrl: './ingredient-position.component.html',
})
export class IngredientPositionComponent {
  public ingredient: InputSignal<Ingredient> = input.required<Ingredient>();
  public measure: InputSignal<string> = input.required<string>();
  public amount: InputSignal<string> = input.required<string>();
  public additional: InputSignal<boolean> = input.required<boolean>();
}
