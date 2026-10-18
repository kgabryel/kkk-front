import type { OnDestroy, OnInit } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { Length } from '@/app/config/form.config';
import { SearchService } from '@/app/core/services/search.service';
import { TagsSearchService } from '@/app/core/services/tags-search.service';
import { BaseComponent } from '@/app/modules/base.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogClose,
    MatIcon,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInput,
    AutocompletePipe,
    MatButton,
  ],
  selector: 'tags-search',
  templateUrl: './search.component.html',
})
export class SearchComponent extends BaseComponent implements OnInit, OnDestroy {
  private static search = '';
  public maxNameLength: number = Length.maxTagNameLength;
  public name: FormControl;
  private searchService: SearchService = inject(SearchService);
  private tagsSearchService: TagsSearchService = inject(TagsSearchService);
  public constructor() {
    super();
    this.name = new FormControl(SearchComponent.search);
  }

  public ngOnInit(): void {
    this.onObservable(() => this.search(), this.name.valueChanges);
    if (this.isUpdated()) {
      this.search();
    }
  }

  public ngOnDestroy(): void {
    SearchComponent.search = this.name.value;
  }

  public clear(): void {
    this.name.setValue('');
    this.emitSearch();
  }

  public search(): void {
    this.tagsSearchService.searchTag(this.name.value);
    this.emitSearch();
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }

  private isUpdated(): boolean {
    return this.name.value !== '';
  }
}
