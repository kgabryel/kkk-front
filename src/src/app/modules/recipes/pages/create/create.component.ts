import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DividerComponent } from '../../../layout/components/divider/divider.component';
import { CreateComponent as CreateFormComponent } from '../../components/create/create.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CreateFormComponent, DividerComponent],
  selector: 'recipes-pages-create',
  standalone: true,
  styleUrls: [],
  templateUrl: './create.component.html',
})
export class CreateComponent {}
