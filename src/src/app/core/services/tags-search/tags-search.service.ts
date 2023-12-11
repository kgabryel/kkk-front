import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class TagsSearchService {

  private search: BehaviorSubject<string>;

  public constructor() {
    this.search = new BehaviorSubject<string>('');
  }

  public searchTag(search: string): void {
    this.search.next(search);
  }

  public getState(): Observable<string> {
    return this.search.asObservable();
  }
}
