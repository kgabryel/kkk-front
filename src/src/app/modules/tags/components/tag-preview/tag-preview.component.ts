import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Tag} from '../../../../core/models/tag';
import {State as TagsState} from '../../../../core/store/tags/reducers';
import {Store} from '@ngrx/store';
import {tagDelete} from '../../../../core/store/tags/actions';
import {State as RecipesState} from '../../../../core/store/recipes/reducers';
import {selectRecipesForTag} from '../../../../core/store/recipes/selectors';
import {Subscription} from 'rxjs';
import {DeleteDialogComponent} from '../../../shared/components/delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'tags-tag-preview',
  templateUrl: './tag-preview.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagPreviewComponent implements OnInit, OnDestroy {
  @Input() public tag: Tag;
  public recipesCount: number;
  @Output() private edit: EventEmitter<boolean>;
  private tagsStore: Store<TagsState>;
  private recipesStore: Store<RecipesState>;
  private subscription: Subscription;
  private dialog: MatDialog;

  public constructor(tagsStore: Store<TagsState>, recipesStore: Store<RecipesState>, dialog: MatDialog) {
    this.edit = new EventEmitter();
    this.tagsStore = tagsStore;
    this.recipesStore = recipesStore;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.recipesCount = 0;
    this.subscription = this.recipesStore.select(selectRecipesForTag(this.tag))
      .subscribe(tags => this.recipesCount = tags.length);
  }

  public startEdit(): void {
    this.edit.emit(true);
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '800px',
      autoFocus: false,
      data: {
        onClose: () => this.tagsStore.dispatch(tagDelete({id: this.tag.id}))
      }
    });
  }


  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
