import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ingredientsRoutes } from '../../config/routes.config';
import { Ingredient } from '../models/ingredient';
import { OzaSupply } from '../models/oza-supply';
import { IngredientRequest } from '../requests/ingredient.request';

@Injectable()
export class IngredientsService {
  private httpClient: HttpClient;
  public constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public add(ingredientRequest: IngredientRequest): Observable<Ingredient> {
    return this.httpClient.post<Ingredient>(ingredientsRoutes.index, ingredientRequest);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<void>(ingredientsRoutes.byId(id)).pipe(map(() => id));
  }

  public getAll(): Observable<Ingredient[]> {
    return this.httpClient.get<Ingredient[]>(ingredientsRoutes.index);
  }

  public getOzaSupplies(): Observable<OzaSupply[]> {
    return this.httpClient.get<OzaSupply[]>(ingredientsRoutes.ozaSupplies);
  }

  public updateAvailable(id: number, available: boolean): Observable<Ingredient> {
    return this.httpClient.patch<Ingredient>(ingredientsRoutes.byId(id), { available });
  }

  public updateName(id: number, name: string): Observable<Ingredient> {
    return this.httpClient.patch<Ingredient>(ingredientsRoutes.byId(id), { name });
  }

  public updateOzaId(id: number, ozaId: number): Observable<Ingredient> {
    return this.httpClient.patch<Ingredient>(ingredientsRoutes.byId(id), { ozaId });
  }
}
