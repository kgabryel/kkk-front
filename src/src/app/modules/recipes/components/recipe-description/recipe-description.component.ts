import type { InputSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';

import { EmptyStringPipe } from '@/app/modules/shared/pipes/empty-string.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyStringPipe, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
  selector: 'recipes-recipe-description',
  styleUrl: './recipe-description.component.scss',
  templateUrl: './recipe-description.component.html',
})
export class RecipeDescriptionComponent {
  public description: InputSignal<string | null> = input.required<string | null>();
}
