import type { InputSignal, OnInit } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Tag } from '@/app/core/models/tag';

import { TagEditComponent } from '@/app/modules/tags/components/tag-edit/tag-edit.component';
import { TagPreviewComponent } from '@/app/modules/tags/components/tag-preview/tag-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagEditComponent, TagPreviewComponent],
  selector: 'tags-tag-container',

  templateUrl: './tag-container.component.html',
})
export class TagContainerComponent implements OnInit {
  public tag: InputSignal<Tag> = input.required<Tag>();
  public edit!: boolean;
  public ngOnInit(): void {
    this.edit = false;
  }

  public changeEdit(value: boolean): void {
    this.edit = value;
  }
}
