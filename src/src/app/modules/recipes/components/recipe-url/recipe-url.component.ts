import type { InputSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';

import { EmptyStringPipe } from '@/app/modules/shared/pipes/empty-string.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EmptyStringPipe, MatButton],
  selector: 'recipes-recipe-url',
  templateUrl: './recipe-url.component.html',
})
export class RecipeUrlComponent {
  public url: InputSignal<string | null> = input.required<string | null>();
}
