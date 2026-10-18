import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Ingredient} from '../../../../core/models/ingredient';

@Component({
  selector: 'ingredients-ingredient-container',
  templateUrl: './ingredient-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientContainerComponent implements OnInit {

  @Input() public ingredient: Ingredient;
  @Input() public ozaKey: string | null;
  public edit: boolean;
  public oza: boolean;

  public ngOnInit(): void {
    this.edit = false;
    this.oza = false;
  }

  public changeEdit(value: boolean[]): void {
    this.edit = value[0];
    this.oza = value[1];
  }
}
