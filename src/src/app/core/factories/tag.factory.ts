import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TagsValidator} from '../validators/tags.validator';
import {Store} from '@ngrx/store';
import {State} from '../store/tags/reducers';
import {Injectable} from '@angular/core';
import {Length} from '../../config/form.config';

export interface TagsFormNames {
  name: string;
}

export const formNames: TagsFormNames = {
  name: 'name'
};

@Injectable()
export class TagFormFactory {

  private readonly store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public getForm(expect: number = 0): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(
        '',
        [Validators.required, Validators.maxLength(Length.maxTagNameLength)],
        [TagsValidator.unique(this.store, expect)])
    });
  }
}
