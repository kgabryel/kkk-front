import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Tag } from '../../models/tag';
import {
  tagAdd,
  tagAddError,
  tagAddFromRecipe,
  tagAddSuccess,
  tagDelete,
  tagDeleteError,
  tagDeleteSuccess,
  tagsLoad,
  tagsLoadError,
  tagsLoadSuccess,
  tagsReset,
  tagUpdate,
  tagUpdateError,
  tagUpdateSuccess,
} from './actions';

export interface State {
  tags: EntityState<Tag>;
  loaded: boolean;
}

export const TAGS_KEY = 'tags';

export const adapter: EntityAdapter<Tag> = createEntityAdapter<Tag>();

const initialState: State = {
  loaded: false,
  tags: adapter.getInitialState(),
};

export const tagsReducer = createReducer(
  initialState,
  on(tagsLoad, (state: State) => state),
  on(tagsLoadError, (state: State) => state),
  on(tagsLoadSuccess, (state: State, action: ReturnType<typeof tagsLoadSuccess>) => ({
    ...state,
    loaded: true,
    tags: adapter.addMany(action.tags, state.tags),
  })),
  on(tagAdd, (state: State) => state),
  on(tagAddFromRecipe, (state: State) => state),
  on(tagAddError, (state: State) => state),
  on(tagAddSuccess, (state: State, action: ReturnType<typeof tagAddSuccess>) => ({
    ...state,
    tags: adapter.addOne(action.tag, state.tags),
  })),
  on(tagDelete, (state: State) => state),
  on(tagDeleteError, (state: State) => state),
  on(tagDeleteSuccess, (state: State, action: ReturnType<typeof tagDeleteSuccess>) => ({
    ...state,
    tags: adapter.removeOne(action.id, state.tags),
  })),
  on(tagUpdate, (state: State) => state),
  on(tagUpdateError, (state: State) => state),
  on(tagUpdateSuccess, (state: State, action: ReturnType<typeof tagUpdateSuccess>) => ({
    ...state,
    tags: adapter.updateOne(action.tag, state.tags),
  })),
  on(tagsReset, () => initialState),
);
