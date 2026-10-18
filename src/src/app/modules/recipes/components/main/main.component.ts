import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FullPhotoComponent } from '../full-photo/full-photo.component';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavigationComponent, RouterOutlet, FullPhotoComponent],
  selector: 'recipes-main',
  standalone: true,
  styleUrls: [],
  templateUrl: './main.component.html',
})
export class MainComponent {}
