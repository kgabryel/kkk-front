import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';

import type { Tag } from '@/app/core/models/tag';

import { tagsRoutes } from '@/app/config/routes.config';

@Injectable()
export class TagsService {
  private httpClient: HttpClient = inject(HttpClient);

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
