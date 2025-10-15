import { ChangeDetectionStrategy, Component, input, InputSignal, OnInit } from '@angular/core';

import { Season } from '../../../../core/models/season';
import { SeasonEditComponent } from '../season-edit/season-edit.component';
import { SeasonPreviewComponent } from '../season-preview/season-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SeasonEditComponent, SeasonPreviewComponent],
  selector: 'seasons-season-container',
  standalone: true,
  styleUrls: [],
  templateUrl: './season-container.component.html',
})
export class SeasonContainerComponent implements OnInit {
  public season: InputSignal<Season> = input.required<Season>();
  public edit!: boolean;
  public ngOnInit(): void {
    this.edit = false;
  }

  public changeEdit(value: boolean): void {
    this.edit = value;
  }
}
