import { ChangeDetectionStrategy, Component, input, OnInit, output, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListItem } from '@angular/material/list';
import { Store } from '@ngrx/store';

import { Length } from '../../../../config/form.config';
import { TagErrors, tagErrors } from '../../../../core/errors/tag.error';
import { formNames, TagFormFactory, TagsFormNames } from '../../../../core/factories/tag.factory';
import { Tag } from '../../../../core/models/tag';
import { tagUpdate } from '../../../../core/store/tags/actions';
import { State } from '../../../../core/store/tags/reducers';
import { FormUtils } from '../../../../core/utils/form.utils';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatListItem,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    AutocompletePipe,
    MatHint,
    ErrorsContainerComponent,
  ],
  providers: [TagFormFactory],
  selector: 'tags-tag-edit',
  standalone: true,
  styleUrls: ['./tag-edit.component.scss'],
  templateUrl: './tag-edit.component.html',
})
export class TagEditComponent extends BaseComponent implements OnInit {
  public tag = input.required<Tag>();
  public edit = output<boolean>();
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
    this.store = store;
    this.tagFormFactory = tagFormFactory;
    this.errors = tagErrors;
    this.maxNameLength = Length.maxTagNameLength;
  }

  public ngOnInit(): void {
    this.name = this.tag().name;
    this.form = this.tagFormFactory.getForm(this.tag().id);
    this.nameLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.name,
      this.tag().name,
    );

    this.form.get(this.formNames.name)?.setValue(this.tag().name, { emitEvent: true });
  }

  public stopEdit(): void {
    this.edit.emit(false);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(
      tagUpdate({
        id: this.tag().id,
        name: this.form.get(this.formNames.name)?.value,
      }),
    );
  }

  public toUppercase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.form.get(this.formNames.name)?.setValue(input.value, { emitEvent: false });
  }
}
