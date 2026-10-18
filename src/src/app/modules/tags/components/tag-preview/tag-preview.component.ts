import type { InputSignal, OnInit, Signal, OutputEmitterRef } from '@angular/core';

import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { Tag } from '@/app/core/models/tag';
import type { State as RecipesState } from '@/app/core/store/recipes/reducers';
import type { State as TagsState } from '@/app/core/store/tags/reducers';

import { selectRecipesForTag } from '@/app/core/store/recipes/selectors';
import { tagDelete } from '@/app/core/store/tags/actions';
import { SignalUtils } from '@/app/core/utils/signal.utils';
import { DeleteDialogComponent } from '@/app/modules/shared/components/delete-dialog/delete-dialog.component';
import { TagRecipesHrefPipe } from '@/app/modules/shared/pipes/tag-recipes-href.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListItem, MatMenuTrigger, MatIcon, MatIconButton, MatMenu, RouterLink, TagRecipesHrefPipe, MatMenuItem],
  selector: 'tags-tag-preview',
  styleUrl: './tag-preview.component.scss',
  templateUrl: './tag-preview.component.html',
})
export class TagPreviewComponent implements OnInit {
  public tag: InputSignal<Tag> = input.required<Tag>();
  public edit: OutputEmitterRef<boolean> = output<boolean>();
  public recipesCount!: Signal<number>;
  private dialog: MatDialog = inject(MatDialog);
  private recipesStore: Store<RecipesState> = inject<Store<RecipesState>>(Store);
  private tagsStore: Store<TagsState> = inject<Store<TagsState>>(Store);

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
