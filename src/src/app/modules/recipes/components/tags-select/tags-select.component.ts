import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  input,
  InputSignal,
  OnInit,
  runInInjectionContext,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatChip, MatChipGrid, MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { startWith } from 'rxjs/operators';

import { Length } from '../../../../config/form.config';
import { formNames, RecipesFormNames } from '../../../../core/factories/recipe.factory';
import { Tag } from '../../../../core/models/tag';
import { tagAddFromRecipe } from '../../../../core/store/tags/actions';
import { State } from '../../../../core/store/tags/reducers';
import { selectTags } from '../../../../core/store/tags/selectors';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { StringUtils } from '../../../../core/utils/string.utils';
import { BaseComponent } from '../../../base.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatAutocomplete,
    MatOption,
    FormsModule,
    MatChipGrid,
    MatChip,
    MatIcon,
    MatChipInput,
    MatAutocompleteTrigger,
  ],
  selector: 'recipes-tags-select',
  standalone: true,
  styleUrls: ['./tags-select.component.scss'],
  templateUrl: './tags-select.component.html',
})
export class TagsSelectComponent extends BaseComponent implements OnInit {
  public searchInput: Signal<ElementRef<HTMLInputElement> | undefined> =
    viewChild<ElementRef<HTMLInputElement>>('searchInput');
  public formGroup: InputSignal<FormGroup> = input.required<FormGroup>();
  public filteredTags!: Tag[];
  public formNames: RecipesFormNames;
  public maxTagNameLength: number;
  public selectedTags!: WritableSignal<string[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public tags!: Signal<Tag[]>;
  private store: Store<State>;
  private tagsInput!: FormArray;
  private destroyRef: DestroyRef;

  public constructor(store: Store<State>, destroyRef: DestroyRef) {
    super();
    this.store = store;
    this.formNames = formNames;
    this.maxTagNameLength = Length.maxTagNameLength;
    this.destroyRef = destroyRef;
  }

  public ngOnInit(): void {
    this.filteredTags = [];
    this.tags = computed(() => {
      const tags = this.store.selectSignal(selectTags);

      return [...tags()].sort((a: Tag, b: Tag) => StringUtils.compareString(a.name, b.name));
    });

    this.tagsInput = this.formGroup().get(this.formNames.tags) as FormArray;
    runInInjectionContext(this.injector, () => {
      this.selectedTags = SignalUtils.makeWritable<string[]>(
        SignalUtils.map(
          this.signalFromObservable(this.tagsInput.valueChanges, this.tagsInput.value),
          (tags: string[]) => tags.map((tag: string) => tag),
        ),
      );
    });
    this.filter();
  }

  public add(event: MatChipInputEvent): void {
    let result: string;

    if ((result = event.value.trim().toUpperCase())) {
      this.tags().forEach((tag: Tag) => {
        if (tag.name.toUpperCase() === result) {
          if (!this.selectedTags().includes(tag.name)) {
            this.tagsInput.push(new FormControl(tag.name));
          }
        }
      });
      if (!this.selectedTags().includes(result)) {
        this.store.dispatch(tagAddFromRecipe({ name: result }));
        this.tagsInput.push(new FormControl(result));
      }
    }
    this.filteredTags = [];
    const input = this.searchInput();

    if (input) {
      input.nativeElement.value = '';
    }
    this.formGroup().get(this.formNames.search)?.reset('');
  }

  public remove(tag: string): void {
    this.selectedTags.update((tags: string[]): string[] =>
      tags.filter((item: string) => item !== tag),
    );
    const tags: string[] = this.selectedTags().map((tag: string) => tag);
    this.tagsInput.clear();
    tags.forEach((tag: string) => this.tagsInput.push(new FormControl(tag)));
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.tags().forEach((tag: Tag) => {
      if (tag.name.toLocaleLowerCase() === event.option.value.toLocaleLowerCase()) {
        if (!this.selectedTags().includes(tag.name)) {
          this.tagsInput.push(new FormControl(tag.name.toUpperCase()));
        }
      }
    });
    let tagValue = event.option.value.toUpperCase();

    if (tagValue.startsWith('DODAĆ: ')) {
      tagValue = tagValue.slice(7);
      tagValue = tagValue.slice(0, tagValue.length - 1);
      if (!this.selectedTags().includes(tagValue)) {
        this.store.dispatch(tagAddFromRecipe({ name: tagValue }));
        this.tagsInput.push(new FormControl(tagValue));
      }
    }
    const input = this.searchInput();

    if (input) {
      input.nativeElement.value = '';
    }
    this.formGroup().get(this.formNames.search)?.reset('');
  }

  private filter(): void {
    const search = this.formGroup().get(this.formNames.search) as AbstractControl;
    search.valueChanges
      .pipe(startWith(''), takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        if (value === '' || value === null) {
          this.filteredTags = this.tags().filter(
            (tag: Tag) => !this.selectedTags().includes(tag.name),
          );

          return;
        }
        this.filteredTags = [];
        this.tags().forEach((tag: Tag) => {
          if (tag.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
            if (!this.selectedTags().includes(tag.name)) {
              this.filteredTags.push(tag);
            }
          }
        });
        if (this.filteredTags.length === 0) {
          this.filteredTags.push({
            id: 0,
            name: `Dodać: ${value}?`,
          });
        }
      });
  }
}
