import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DividerComponent } from '@/app/modules/layout/components/divider/divider.component';
import { CreateComponent as CreateFormComponent } from '@/app/modules/recipes/components/create/create.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CreateFormComponent, DividerComponent],
  selector: 'recipes-pages-create',
  templateUrl: './create.component.html',
})
export class CreateComponent {}
