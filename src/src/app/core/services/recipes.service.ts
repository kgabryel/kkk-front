import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { first, map } from 'rxjs/operators';

import type { PhotosConfig } from '@/app/config/photos.config';
import type { Order, Photo } from '@/app/core/models/photo';
import type { Recipe } from '@/app/core/models/recipe';
import type { PhotoRequest, RecipeRequest } from '@/app/core/requests/recipe.request';

import { recipesRoutes } from '@/app/config/routes.config';

@Injectable()
export class RecipesService {
  private httpClient: HttpClient = inject(HttpClient);

  public static mapPhoto(photo: Photo, data: ArrayBuffer): string {
    const blob = new Blob([data], { type: photo.type });

    return URL.createObjectURL(blob);
  }

  public add(recipe: RecipeRequest): Observable<Recipe> {
    return this.httpClient.post<Recipe>(recipesRoutes.index, recipe);
  }

  public addPhoto(id: number, photo: PhotoRequest): Observable<Recipe> {
    return this.httpClient.post<Recipe>(recipesRoutes.photos(id), photo);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<void>(recipesRoutes.byId(id)).pipe(map(() => id));
  }

  public deletePhoto(recipeId: number, photoId: number): Observable<Recipe> {
    return this.httpClient.delete<Recipe>(recipesRoutes.photoById(recipeId, photoId));
  }

  public getAll(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(recipesRoutes.index);
  }

  public getPhoto(recipeId: number, photoId: number, type: PhotosConfig): Observable<ArrayBuffer> {
    return this.httpClient
      .get(recipesRoutes.getPhoto(recipeId, photoId, type), { responseType: 'arraybuffer' })
      .pipe(first());
  }

  public reorderPhotos(id: number, order: Order[]): Observable<Recipe> {
    return this.httpClient.patch<Recipe>(recipesRoutes.photos(id), { order: order });
  }

  public update(id: number, recipe: RecipeRequest): Observable<Recipe> {
    return this.httpClient.put<Recipe>(recipesRoutes.byId(id), recipe);
  }

  public updateFavourite(id: number, favourite: boolean): Observable<Recipe> {
    return this.httpClient.patch<Recipe>(recipesRoutes.byId(id), { favourite });
  }

  public updateToDo(id: number, toDo: boolean): Observable<Recipe> {
    return this.httpClient.patch<Recipe>(recipesRoutes.byId(id), { toDo });
  }
}
