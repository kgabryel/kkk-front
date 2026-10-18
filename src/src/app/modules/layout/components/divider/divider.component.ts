import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'layout-divider',
  styleUrl: './divider.component.scss',
  templateUrl: './divider.component.html',
})
export class DividerComponent {}
