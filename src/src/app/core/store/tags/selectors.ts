import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { Recipe } from '../../models/recipe';
import { Tag } from '../../models/tag';
import { StringUtils } from '../../utils/string.utils';
import { adapter, State, TAGS_KEY } from './reducers';

const selectState = createFeatureSelector<State>(TAGS_KEY);

const tagsState = createSelector(selectState, (selectState: State) => selectState.tags);

const { selectAll } = adapter.getSelectors(tagsState);

export const selectTags = selectAll;

export const selectIsLoaded = createSelector(
  selectState,
  (selectState: State) => selectState.loaded,
);

export const selectTagsForRecipe = (recipe: Recipe): MemoizedSelector<object, Tag[]> =>
  createSelector(selectTags, (tags: Tag[]) =>
    tags.filter((tag: Tag) => recipe.tags.includes(tag.id)),
  );

export const selectTagById = (id: number): MemoizedSelector<object, Tag | undefined> =>
  createSelector(selectTags, (tags: Tag[]) => tags.find((tag: Tag) => tag.id === id));

export const selectTagByName = (name: string): MemoizedSelector<object, Tag | undefined> =>
  createSelector(selectTags, (tags: Tag[]) =>
    tags.find((tag: Tag) => tag.name.toLowerCase() === name.toLowerCase()),
  );

export const searchTags = (name: string): MemoizedSelector<object, Tag[]> =>
  createSelector(selectTags, (tags: Tag[]) =>
    tags.filter((tag: Tag) => StringUtils.stringIncludes(tag.name, name)),
  );
