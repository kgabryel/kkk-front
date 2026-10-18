import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { tagsRoutes } from '../../config/routes.config';
import { Tag } from '../models/tag';

@Injectable()
export class TagsService {
  private httpClient: HttpClient;
  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public add(name: string): Observable<Tag> {
    return this.httpClient.post<Tag>(tagsRoutes.index, { name });
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<void>(tagsRoutes.byId(id)).pipe(map(() => id));
  }

  public getAll(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(tagsRoutes.index);
  }

  public update(id: number, name: string): Observable<Tag> {
    return this.httpClient.put<Tag>(tagsRoutes.byId(id), { name });
  }
}
