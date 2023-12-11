import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {TagsSearchService} from '../../../../core/services/tags-search/tags-search.service';
import {SearchService} from '../../../../core/services/search/search.service';
import {Length} from '../../../../config/form.config';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'tags-search',
  templateUrl: './search.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private static search: string = '';
  public name: FormControl;
  public maxNameLength: number;
  private tagsSearchService: TagsSearchService;
  private searchService: SearchService;
  private subscription: Subscription;

  public constructor(tagsSearchService: TagsSearchService, searchService: SearchService) {
    this.name = new FormControl();
    this.name.setValue(SearchComponent.search);
    this.tagsSearchService = tagsSearchService;
    this.searchService = searchService;
    this.maxNameLength = Length.maxTagNameLength;
  }

  public ngOnInit(): void {
    this.subscription = this.name.valueChanges.subscribe(() => this.search());
    if (this.isUpdated()) {
      this.search();
    }
  }

  public search(): void {
    this.tagsSearchService.searchTag(this.name.value);
    this.emitSearch();
  }

  public clear(): void {
    this.name.setValue('');
    this.emitSearch();
  }

  public ngOnDestroy(): void {
    SearchComponent.search = this.name.value;
    this.subscription.unsubscribe();
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }

  private isUpdated(): boolean {
    return this.name.value !== '';
  }
}
