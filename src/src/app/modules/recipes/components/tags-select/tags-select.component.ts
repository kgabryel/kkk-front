import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Tag} from '../../../../core/models/tag';
import {MatChipInputEvent} from '@angular/material/chips';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tags/reducers';
import {selectTags} from '../../../../core/store/tags/selectors';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {formNames, RecipesFormNames} from '../../../../core/factories/recipe.factory';
import {startWith} from 'rxjs/operators';
import {tagAddFromRecipe} from '../../../../core/store/tags/actions';
import {Length} from '../../../../config/form.config';
import {Subscription} from 'rxjs';

@Component({
  selector: 'recipes-tags-select',
  templateUrl: './tags-select.component.html',
  styleUrls: ['./tags-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsSelectComponent implements OnInit, OnDestroy {

  @Input() public formGroup: FormGroup;
  @ViewChild('searchInput') public searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') public matAutocomplete: MatAutocomplete;
  @ViewChild('chipList') public chipList: any;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredTags: Tag[];
  public selectedTags: string[];
  public tags: Tag[];
  public formNames: RecipesFormNames;
  public maxTagNameLength: number;
  private store: Store<State>;
  private tagsInput: FormArray;
  private subscriptions: Subscription[];

  public constructor(store: Store<State>) {
    this.store = store;
    this.formNames = formNames;
    this.maxTagNameLength = Length.maxTagNameLength;
  }

  public ngOnInit(): void {
    this.selectedTags = [];
    this.subscriptions = [
      this.store.select(selectTags).subscribe(tags => this.tags = tags.sort(
        (a, b) => a.name.toLowerCase()
          .localeCompare(b.name.toLowerCase()))
      )];
    this.filter();
    this.tagsInput = this.formGroup.get(this.formNames.tags) as FormArray;
    this.tagsInput.controls.forEach(tag => this.selectedTags.push(tag.value));
    this.subscriptions.push(
      this.tagsInput.valueChanges.subscribe(tags => {
        this.selectedTags = [];
        tags.forEach((tag: string) => this.selectedTags.push(tag));
      })
    );
  }

  public add(event: MatChipInputEvent): void {
    let result: string;
    if ((result = event.value.trim().toUpperCase())) {
      this.tags.forEach(tag => {
        if (tag.name.toUpperCase() === result) {
          if (!this.selectedTags.includes(tag.name)) {
            this.tagsInput.push(new FormControl(tag.name));
          }
        }
      });
      if (!this.selectedTags.includes(result)) {
        this.store.dispatch(tagAddFromRecipe({name: result}));
        this.tagsInput.push(new FormControl(result));
      }
    }
    this.filteredTags = [];
    this.searchInput.nativeElement.value = '';
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.forEach(tag => {
      if (tag.name.toLocaleLowerCase() === event.option.value.toLocaleLowerCase()) {
        if (!this.selectedTags.includes(tag.name)) {
          this.tagsInput.push(new FormControl(tag.name.toUpperCase()));
        }
      }
    });
    let tagValue = event.option.value.toUpperCase();
    if (tagValue.startsWith('DODAĆ: ')) {
      tagValue = tagValue.slice(7);
      tagValue = tagValue.slice(0, tagValue.length - 1);
      if (!this.selectedTags.includes(tagValue)) {
        this.store.dispatch(tagAddFromRecipe({name: tagValue}));
        this.tagsInput.push(new FormControl(tagValue));
      }
    }
    this.searchInput.nativeElement.value = '';
  }

  public remove(tag: string): void {
    this.selectedTags = this.selectedTags.filter(item => item !== tag);
    const tags: string[] = this.selectedTags.map(tag => tag);
    this.tagsInput.clear();
    tags.forEach(tag => this.tagsInput.push(new FormControl(tag)));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private filter(): void {
    const search = this.formGroup.get(this.formNames.search) as AbstractControl;
    search.valueChanges.pipe(startWith('')).subscribe(value => {
      if (value === '' || value === null) {
        this.filteredTags = this.tags.filter(tag => !this.selectedTags.includes(tag.name));
        return;
      }
      this.filteredTags = [];
      this.tags.forEach(tag => {
        if (tag.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
          if (!this.selectedTags.includes(tag.name)) {
            this.filteredTags.push(tag);
          }
        }
      });
      if (this.filteredTags.length === 0) {
        this.filteredTags.push({
          id: 0,
          name: `Dodać: ${value}?`
        });
      }
    });
  }
}
