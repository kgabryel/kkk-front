import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames, TagFormFactory, TagsFormNames} from '../../../../core/factories/tag.factory';
import {tagErrors, TagErrors} from '../../../../core/errors/tag.error';
import {tagAdd} from '../../../../core/store/tags/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tags/reducers';
import {Length} from '../../../../config/form.config';
import {Observable} from 'rxjs';
import {FormUtils} from '../../../../core/utils/form.utils';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'tags-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit {
  public form: FormGroup;
  public formNames: TagsFormNames;
  public errors: TagErrors;
  public nameLength$: Observable<number>;
  public name: string;
  public maxNameLength: number;
  private store: Store<State>;
  private tagFormFactory: TagFormFactory;

  public constructor(store: Store<State>, tagFormFactory: TagFormFactory) {
    this.formNames = formNames;
    this.errors = tagErrors;
    this.store = store;
    this.name = '';
    this.maxNameLength = Length.maxTagNameLength;
    this.tagFormFactory = tagFormFactory;
  }

  public ngOnInit(): void {
    this.form = this.tagFormFactory.getForm();
    this.nameLength$ = (this.form.get(this.formNames.name) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(tagAdd({
      name: this.form.get(this.formNames.name)?.value
    }));
    this.clearForm();
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.form, '', this.formNames.name);
    this.name = '';
  }
}
