import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';

import { Tag } from '../../../../core/models/tag';
import { TagEditComponent } from '../tag-edit/tag-edit.component';
import { TagPreviewComponent } from '../tag-preview/tag-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagEditComponent, TagPreviewComponent],
  selector: 'tags-tag-container',
  standalone: true,
  styleUrls: [],
  templateUrl: './tag-container.component.html',
})
export class TagContainerComponent implements OnInit {
  public tag = input.required<Tag>();
  public edit!: boolean;
  public ngOnInit(): void {
    this.edit = false;
  }

  public changeEdit(value: boolean): void {
    this.edit = value;
  }
}
