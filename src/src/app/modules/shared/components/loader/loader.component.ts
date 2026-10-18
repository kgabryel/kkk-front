import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'shared-loader',
  styleUrl: './loader.component.scss',
  templateUrl: './loader.component.html',
})
export class LoaderComponent {}
