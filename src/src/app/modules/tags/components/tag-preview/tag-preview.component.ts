import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../../core/models/recipe';
import { Tag } from '../../../../core/models/tag';
import { State as RecipesState } from '../../../../core/store/recipes/reducers';
import { selectRecipesForTag } from '../../../../core/store/recipes/selectors';
import { tagDelete } from '../../../../core/store/tags/actions';
import { State as TagsState } from '../../../../core/store/tags/reducers';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { TagRecipesHrefPipe } from '../../../shared/pipes/tag-recipes-href.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListItem,
    MatMenuTrigger,
    MatIcon,
    MatIconButton,
    MatMenu,
    RouterLink,
    TagRecipesHrefPipe,
    MatMenuItem,
  ],
  selector: 'tags-tag-preview',
  standalone: true,
  styleUrls: ['./tag-preview.component.scss'],
  templateUrl: './tag-preview.component.html',
})
export class TagPreviewComponent implements OnInit {
  public tag: InputSignal<Tag> = input.required<Tag>();
  public edit = output<boolean>();
  public recipesCount!: Signal<number>;
  private dialog: MatDialog;
  private recipesStore: Store<RecipesState>;
  private tagsStore: Store<TagsState>;
  public constructor(
    tagsStore: Store<TagsState>,
    recipesStore: Store<RecipesState>,
    dialog: MatDialog,
  ) {
    this.tagsStore = tagsStore;
    this.recipesStore = recipesStore;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.recipesCount = SignalUtils.map<Recipe[], number>(
      this.recipesStore.selectSignal(selectRecipesForTag(this.tag())),
      (recipes: Recipe[]): number => recipes.length,
    );
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () => this.tagsStore.dispatch(tagDelete({ id: this.tag().id })),
      },
      width: '800px',
    });
  }

  public startEdit(): void {
    this.edit.emit(true);
  }
}
