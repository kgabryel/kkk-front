import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Ingredient} from '../../../../core/models/ingredient';

@Component({
  selector: 'recipes-ingredient-position',
  templateUrl: './ingredient-position.component.html',
  styleUrls: ['./ingredient-position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientPositionComponent {

  @Input() public ingredient: Ingredient | null | undefined;
  @Input() public measure: string;
  @Input() public amount: string;
  @Input() public additional: boolean;

}
