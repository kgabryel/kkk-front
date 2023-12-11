import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Recipe} from '../../models/recipe';
import {recipesRoutes} from '../../../config/routes.config';
import {first, map} from 'rxjs/operators';
import {PhotoRequest, RecipeRequest} from '../../requests/recipe.request';
import {PhotosConfig} from '../../../config/photos.config';
import {Buffer} from 'buffer';
import {Order, Photo} from '../../models/photo';

@Injectable()
export class RecipesService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public static mapPhoto(photo: Photo, data: ArrayBuffer): string {
    return `data:${photo.type};base64,` + Buffer.from(data).toString('base64');
  }

  public getAll(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(recipesRoutes.index);
  }

  public add(recipe: RecipeRequest): Observable<Recipe> {
    return this.httpClient.post<Recipe>(recipesRoutes.index, recipe);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(recipesRoutes.byId(id)).pipe(map(() => id));
  }

  public update(id: number, recipe: RecipeRequest): Observable<Recipe> {
    return this.httpClient.put<Recipe>(recipesRoutes.byId(id), recipe);
  }

  public updateFavourite(id: number, favourite: boolean): Observable<Recipe> {
    return this.httpClient.patch<Recipe>(recipesRoutes.byId(id), {favourite});
  }

  public updateToDo(id: number, toDo: boolean): Observable<Recipe> {
    return this.httpClient.patch<Recipe>(recipesRoutes.byId(id), {toDo});
  }

  public addPhoto(id: number, photo: PhotoRequest): Observable<Recipe> {
    return this.httpClient.post<Recipe>(recipesRoutes.photos(id), photo);
  }

  public getPhoto(recipeId: number, photoId: number, type: PhotosConfig): Observable<ArrayBuffer> {
    return this.httpClient.get(recipesRoutes.getPhoto(recipeId, photoId, type), {responseType: 'arraybuffer'})
      .pipe(first());
  }

  public reorderPhotos(id: number, order: Order[]): Observable<Recipe> {
    return this.httpClient.patch<Recipe>(recipesRoutes.photos(id), {order: order});
  }

  public deletePhoto(recipeId: number, photoId: number): Observable<Recipe> {
    return this.httpClient.delete<Recipe>(recipesRoutes.photoById(recipeId, photoId));
  }
}
