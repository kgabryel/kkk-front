import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {Store} from '@ngrx/store';
import {State} from '../store/tags/reducers';
import {selectTagByName} from '../store/tags/selectors';
import {first, map} from 'rxjs/operators';

export class TagsValidator {
  public static unique(store: Store<State>, expect: number = 0): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return store.select(selectTagByName(control.value)).pipe(
        map(tag => {
          if (tag === undefined) {
            return null;
          }
          return tag.id === expect ? null : {notUnique: true};
        }),
        first()
      );
    };
  }
}
