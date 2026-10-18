import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import type { State } from '@/app/core/store/tags/reducers';

import { Length } from '@/app/config/form.config';
import { TagsValidator } from '@/app/core/validators/tags.validator';

export interface TagsFormNames {
  name: string;
}

export const formNames: TagsFormNames = {
  name: 'name',
};

@Injectable()
export class TagFormFactory {
  private readonly store: Store<State> = inject<Store<State>>(Store);

  public getForm(expect: number = 0): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(
        '',
        [Validators.required, Validators.maxLength(Length.maxTagNameLength)],
        [TagsValidator.unique(this.store, expect)],
      ),
    });
  }
}
