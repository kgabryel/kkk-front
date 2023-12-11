import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../../core/models/tag';

@Component({
  selector: 'tags-tag-container',
  templateUrl: './tag-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagContainerComponent implements OnInit {

  @Input() public tag: Tag;
  public edit: boolean;

  public ngOnInit(): void {
    this.edit = false;
  }

  public changeEdit(value: boolean): void {
    this.edit = value;
  }
}
