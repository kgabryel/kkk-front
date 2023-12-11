import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Season} from '../../../../core/models/season';

@Component({
  selector: 'seasons-season-container',
  templateUrl: './season-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonContainerComponent implements OnInit {

  @Input() public season: Season;
  public edit: boolean;

  public ngOnInit(): void {
    this.edit = false;
  }

  public changeEdit(value: boolean): void {
    this.edit = value;
  }
}
