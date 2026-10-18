import type { OnInit, Signal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Store } from '@ngrx/store';

import type { TagErrors } from '@/app/core/errors/tag.error';
import type { TagsFormNames } from '@/app/core/factories/tag.factory';
import type { State } from '@/app/core/store/tags/reducers';

import { Length } from '@/app/config/form.config';
import { tagErrors } from '@/app/core/errors/tag.error';
import { formNames, TagFormFactory } from '@/app/core/factories/tag.factory';
import { tagAdd } from '@/app/core/store/tags/actions';
import { FormUtils } from '@/app/core/utils/form.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

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
  styleUrl: './create.component.scss',
  templateUrl: './create.component.html',
})
export class CreateComponent extends BaseComponent implements OnInit {
  public errors: TagErrors = tagErrors;
  public form!: FormGroup;
  public formNames: TagsFormNames = formNames;
  public maxNameLength: number = Length.maxTagNameLength;
  public name: string = '';
  public nameLength!: Signal<number>;
  private store: Store<State> = inject<Store<State>>(Store);
  private tagFormFactory: TagFormFactory = inject(TagFormFactory);

  public ngOnInit(): void {
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
