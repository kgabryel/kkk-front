import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'layout-divider',
  standalone: true,
  styleUrls: ['./divider.component.scss'],
  templateUrl: './divider.component.html',
})
export class DividerComponent {}
