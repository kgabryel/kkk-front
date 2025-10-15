import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Store } from '@ngrx/store';

import { Length } from '../../../../config/form.config';
import { tagErrors, TagErrors } from '../../../../core/errors/tag.error';
import { formNames, TagFormFactory, TagsFormNames } from '../../../../core/factories/tag.factory';
import { tagAdd } from '../../../../core/store/tags/actions';
import { State } from '../../../../core/store/tags/reducers';
import { FormUtils } from '../../../../core/utils/form.utils';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    AutocompletePipe,
    MatHint,
    MatInput,
    ErrorsContainerComponent,
    MatIcon,
    MatButton,
  ],
  providers: [TagFormFactory],
  selector: 'tags-create',
  standalone: true,
  styleUrls: ['./create.component.scss'],
  templateUrl: './create.component.html',
})
export class CreateComponent extends BaseComponent implements OnInit {
  public errors: TagErrors;
  public form!: FormGroup;
  public formNames: TagsFormNames;
  public maxNameLength: number;
  public name!: string;
  public nameLength!: Signal<number>;
  private store: Store<State>;
  private tagFormFactory: TagFormFactory;
  public constructor(store: Store<State>, tagFormFactory: TagFormFactory) {
    super();
    this.formNames = formNames;
    this.errors = tagErrors;
    this.store = store;
    this.maxNameLength = Length.maxTagNameLength;
    this.tagFormFactory = tagFormFactory;
  }

  public ngOnInit(): void {
    this.name = '';
    this.form = this.tagFormFactory.getForm();
    this.nameLength = FormUtils.getLength(this.injector, this.form, this.formNames.name);
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.form, '', this.formNames.name);
    this.name = '';
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(
      tagAdd({
        name: this.form.get(this.formNames.name)?.value,
      }),
    );
    this.clearForm();
  }

  public toUppercase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.form.get(this.formNames.name)?.setValue(input.value, { emitEvent: false });
  }
}
