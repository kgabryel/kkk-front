import type { InputSignal, OnInit } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Season } from '@/app/core/models/season';

import { SeasonEditComponent } from '@/app/modules/seasons/components/season-edit/season-edit.component';
import { SeasonPreviewComponent } from '@/app/modules/seasons/components/season-preview/season-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SeasonEditComponent, SeasonPreviewComponent],
  selector: 'seasons-season-container',
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
