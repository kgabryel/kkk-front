import type { InputSignal, OnInit, Signal, OutputEmitterRef } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListItem } from '@angular/material/list';
import { Store } from '@ngrx/store';

import type { TagErrors } from '@/app/core/errors/tag.error';
import type { TagsFormNames } from '@/app/core/factories/tag.factory';
import type { Tag } from '@/app/core/models/tag';
import type { State } from '@/app/core/store/tags/reducers';

import { Length } from '@/app/config/form.config';
import { tagErrors } from '@/app/core/errors/tag.error';
import { formNames, TagFormFactory } from '@/app/core/factories/tag.factory';
import { tagUpdate } from '@/app/core/store/tags/actions';
import { FormUtils } from '@/app/core/utils/form.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

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
  styleUrl: './tag-edit.component.scss',
  templateUrl: './tag-edit.component.html',
})
export class TagEditComponent extends BaseComponent implements OnInit {
  public tag: InputSignal<Tag> = input.required<Tag>();
  public edit: OutputEmitterRef<boolean> = output<boolean>();
  public errors: TagErrors = tagErrors;
  public form!: FormGroup;
  public formNames: TagsFormNames = formNames;
  public maxNameLength: number = Length.maxTagNameLength;
  public name!: string;
  public nameLength!: Signal<number>;
  private store: Store<State> = inject<Store<State>>(Store);
  private tagFormFactory: TagFormFactory = inject(TagFormFactory);

  public ngOnInit(): void {
    this.name = this.tag().name;
    this.form = this.tagFormFactory.getForm(this.tag().id);
    this.nameLength = FormUtils.getLength(this.injector, this.form, this.formNames.name, this.tag().name);

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
