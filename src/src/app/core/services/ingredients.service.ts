import type { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { OzaSupply } from '@/app/core/models/oza-supply';
import type { IngredientRequest } from '@/app/core/requests/ingredient.request';

import { ingredientsRoutes } from '@/app/config/routes.config';

@Injectable()
export class IngredientsService {
  private httpClient: HttpClient = inject(HttpClient);

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
