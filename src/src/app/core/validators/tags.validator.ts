import type { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import type { Store } from '@ngrx/store';

import { first, map } from 'rxjs/operators';

import type { Tag } from '@/app/core/models/tag';
import type { State } from '@/app/core/store/tags/reducers';

import { selectTagByName } from '@/app/core/store/tags/selectors';

export class TagsValidator {
  public static unique(store: Store<State>, expect = 0): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return store.select(selectTagByName(control.value)).pipe(
        map((tag: Tag | undefined) => {
          if (tag === undefined) {
            return null;
          }

          return tag.id === expect ? null : { notUnique: true };
        }),
        first(),
      );
    };
  }
}
