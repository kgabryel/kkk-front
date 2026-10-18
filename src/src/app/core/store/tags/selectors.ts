import type { MemoizedSelector } from '@ngrx/store';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { Tag } from '@/app/core/models/tag';

import { StringUtils } from '@/app/core/utils/string.utils';

import type { State } from './reducers';

import { adapter, TAGS_KEY } from './reducers';

const selectState = createFeatureSelector<State>(TAGS_KEY);

const tagsState = createSelector(selectState, (selectState: State) => selectState.tags);

const { selectAll } = adapter.getSelectors(tagsState);

export const selectTags = createSelector(selectAll, (tags: Tag[]) =>
  [...tags].sort((a: Tag, b: Tag) => StringUtils.compareString(a.name, b.name)),
);

export const selectIsLoaded = createSelector(selectState, (selectState: State) => selectState.loaded);

export const selectTagsForRecipe = (recipe: Recipe): MemoizedSelector<object, Tag[]> =>
  createSelector(selectTags, (tags: Tag[]) => tags.filter((tag: Tag) => recipe.tags.includes(tag.id)));

export const selectTagById = (id: number): MemoizedSelector<object, Tag | undefined> =>
  createSelector(selectTags, (tags: Tag[]) => tags.find((tag: Tag) => tag.id === id));

export const selectTagByName = (name: string): MemoizedSelector<object, Tag | undefined> =>
  createSelector(selectTags, (tags: Tag[]) => tags.find((tag: Tag) => tag.name.toLowerCase() === name.toLowerCase()));

export const searchTags = (name: string): MemoizedSelector<object, Tag[]> =>
  createSelector(selectTags, (tags: Tag[]) => tags.filter((tag: Tag) => StringUtils.stringIncludes(tag.name, name)));
