import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FullPhotoComponent } from '@/app/modules/recipes/components/full-photo/full-photo.component';
import { NavigationComponent } from '@/app/modules/recipes/components/navigation/navigation.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavigationComponent, RouterOutlet, FullPhotoComponent],
  selector: 'recipes-main',
  templateUrl: './main.component.html',
})
export class MainComponent {}
