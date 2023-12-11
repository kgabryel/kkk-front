import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, State, TAGS_KEY} from './reducers';
import {Recipe} from '../../models/recipe';
import {StringUtils} from '../../utils/string.utils';

const selectState = createFeatureSelector<State>(TAGS_KEY);

const tagsState = createSelector(selectState, (selectState: State) => selectState.tags);

const {selectAll} = adapter.getSelectors(tagsState);

export const selectTags = selectAll;

export const selectIsLoaded = createSelector(selectState, selectState => selectState.loaded);

export const selectTagsForRecipe = (recipe: Recipe) => createSelector(
  selectTags,
  tags => (tags.filter(tag => recipe.tags.includes(tag.id)))
);

export const selectTagById = (id: number) => createSelector(
  selectTags,
  tags => tags.find(tag => tag.id === id)
);

export const selectTagByName = (name: string) => createSelector(
  selectTags,
  tags => tags.find(tag => tag.name.toLowerCase() === name.toLowerCase())
);

export const searchTags = (name: string) => createSelector(
  selectTags,
  tags => tags.filter(tag => StringUtils.stringIncludes(tag.name, name))
);
