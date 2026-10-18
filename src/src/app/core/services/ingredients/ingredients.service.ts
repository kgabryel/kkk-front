import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Ingredient} from '../../models/ingredient';
import {ingredientsRoutes} from '../../../config/routes.config';
import {map} from 'rxjs/operators';
import {IngredientRequest} from '../../requests/ingredient.request';
import {OzaSupply} from '../../models/oza-supply';

@Injectable()
export class IngredientsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public getAll(): Observable<Ingredient[]> {
    return this.httpClient.get<Ingredient[]>(ingredientsRoutes.index);
  }

  public add(ingredientRequest: IngredientRequest): Observable<Ingredient> {
    return this.httpClient.post<Ingredient>(ingredientsRoutes.index, ingredientRequest);
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<any>(ingredientsRoutes.byId(id)).pipe(map(() => id));
  }

  public updateName(id: number, name: string): Observable<Ingredient> {
    return this.httpClient.patch<Ingredient>(ingredientsRoutes.byId(id), {name});
  }

  public updateOzaId(id: number, ozaId: number): Observable<Ingredient> {
    return this.httpClient.patch<Ingredient>(ingredientsRoutes.byId(id), {ozaId});
  }

  public getOzaSupplies(): Observable<OzaSupply[]> {
    return this.httpClient.get<OzaSupply[]>(ingredientsRoutes.ozaSupplies);
  }

  public updateAvailable(id: number, available: boolean): Observable<Ingredient> {
    return this.httpClient.patch<Ingredient>(ingredientsRoutes.byId(id), {available});
  }
}
