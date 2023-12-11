import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Tag} from '../../models/tag';
import {tagsRoutes} from '../../../config/routes.config';
import {map} from 'rxjs/operators';

@Injectable()
export class TagsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(tagsRoutes.index);
  }

  public add(name: string): Observable<Tag> {
    return this.httpClient.post<Tag>(tagsRoutes.index, {name});
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(tagsRoutes.byId(id)).pipe(map(() => id));
  }

  public update(id: number, name: string): Observable<Tag> {
    return this.httpClient.put<Tag>(tagsRoutes.byId(id), {name});
  }
}
