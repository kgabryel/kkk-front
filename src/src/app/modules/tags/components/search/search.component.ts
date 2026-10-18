import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { Length } from '../../../../config/form.config';
import { SearchService } from '../../../../core/services/search.service';
import { TagsSearchService } from '../../../../core/services/tags-search.service';
import { BaseComponent } from '../../../base.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

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
  standalone: true,
  styleUrls: [],
  templateUrl: './search.component.html',
})
export class SearchComponent extends BaseComponent implements OnInit, OnDestroy {
  private static search: string = '';
  public maxNameLength: number;
  public name: FormControl;
  private searchService: SearchService;
  private tagsSearchService: TagsSearchService;
  public constructor(tagsSearchService: TagsSearchService, searchService: SearchService) {
    super();
    this.name = new FormControl();
    this.name.setValue(SearchComponent.search);
    this.tagsSearchService = tagsSearchService;
    this.searchService = searchService;
    this.maxNameLength = Length.maxTagNameLength;
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
