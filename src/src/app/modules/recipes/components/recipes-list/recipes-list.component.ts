import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';
import {masonryConfig} from '../../../../config/masonry.config';

@Component({
  selector: 'recipes-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent {

  @Input() public recipes: Observable<Recipe[]>;
  public options = masonryConfig;
}
