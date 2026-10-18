import type { HttpErrorResponse } from '@angular/common/http';
import type { Update } from '@ngrx/entity';
import type { Action } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import type { Ingredient } from '@/app/core/models/ingredient';

import { RoutingConfig } from '@/app/config/routing.config';
import { messages } from '@/app/core/messages/ingredients.messages';
import { IngredientsService } from '@/app/core/services/ingredients.service';
import { BaseEffect } from '@/app/core/store/BaseEffect';
import { PathUtils } from '@/app/core/utils/path.utils';

import {
  ingredientAdd,
  ingredientAddError,
  ingredientAddSuccess,
  ingredientAvailableUpdate,
  ingredientDelete,
  ingredientDeleteError,
  ingredientDeleteSuccess,
  ingredientNameUpdate,
  ingredientOzaIdUpdate,
  ingredientsLoad,
  ingredientsLoadError,
  ingredientsLoadSuccess,
  ingredientUpdateError,
  ingredientUpdateSuccess,
} from './actions';

@Injectable()
export class IngredientsEffects extends BaseEffect<IngredientsService> {
  public addIngredient!: Observable<Action>;
  public deleteIngredient!: Observable<Action>;
  public loadIngredients!: Observable<Action>;
  public updateIngredientAvailable!: Observable<Action>;
  public updateIngredientName!: Observable<Action>;
  public updateIngredientOzaId!: Observable<Action>;
  protected readonly service: IngredientsService = inject(IngredientsService);

  private static ingredientUpdateSuccess(
    ingredient: Ingredient,
    id: number,
  ): ReturnType<typeof ingredientUpdateSuccess> {
    const update: Update<Ingredient> = { changes: ingredient, id };

    return ingredientUpdateSuccess({ ingredient: update });
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateNameEffect();
    this.createUpdateAvailableEffect();
    this.createUpdateOzaIdEffect();
  }

  private createAddEffect(): void {
    this.addIngredient = createEffect(() =>
      this.actions.pipe(
        ofType(ingredientAdd),
        switchMap((action: ReturnType<typeof ingredientAdd>) =>
          this.service.add(action.ingredient).pipe(
            tap(() => {
              void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.ingredients));
              this.notificationService.showMessage(messages.ingredientAdded);
            }),
            map((ingredient: Ingredient) => ingredientAddSuccess({ ingredient })),
            catchError((error: HttpErrorResponse) => this.error(error, ingredientAddError())),
          ),
        ),
      ),
    );
  }

  private createDeleteEffect(): void {
    this.deleteIngredient = createEffect(() =>
      this.actions.pipe(
        ofType(ingredientDelete),
        switchMap((action: ReturnType<typeof ingredientDelete>) =>
          this.service.delete(action.id).pipe(
            tap(() => this.notificationService.showMessage(messages.ingredientDeleted)),
            map((id: number) => ingredientDeleteSuccess({ id })),
            catchError((error: HttpErrorResponse) => this.error(error, ingredientDeleteError())),
          ),
        ),
      ),
    );
  }

  private createLoadEffect(): void {
    this.loadIngredients = createEffect(() =>
      this.actions.pipe(
        ofType(ingredientsLoad),
        switchMap(() =>
          this.service.getAll().pipe(
            map((ingredients: Ingredient[]) => ingredientsLoadSuccess({ ingredients })),
            catchError((error: HttpErrorResponse) => this.error(error, ingredientsLoadError())),
          ),
        ),
      ),
    );
  }

  private createUpdateAvailableEffect(): void {
    this.updateIngredientAvailable = createEffect(() =>
      this.actions.pipe(
        ofType(ingredientAvailableUpdate),
        switchMap((action: ReturnType<typeof ingredientAvailableUpdate>) =>
          this.service.updateAvailable(action.id, action.available).pipe(
            tap(() => this.notificationService.showMessage(messages.ingredientUpdated)),
            map((ingredient: Ingredient) => IngredientsEffects.ingredientUpdateSuccess(ingredient, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, ingredientUpdateError())),
          ),
        ),
      ),
    );
  }

  private createUpdateNameEffect(): void {
    this.updateIngredientName = createEffect(() =>
      this.actions.pipe(
        ofType(ingredientNameUpdate),
        switchMap((action: ReturnType<typeof ingredientNameUpdate>) =>
          this.service.updateName(action.id, action.name).pipe(
            tap(() => this.notificationService.showMessage(messages.ingredientUpdated)),
            map((ingredient: Ingredient) => IngredientsEffects.ingredientUpdateSuccess(ingredient, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, ingredientUpdateError())),
          ),
        ),
      ),
    );
  }

  private createUpdateOzaIdEffect(): void {
    this.updateIngredientOzaId = createEffect(() =>
      this.actions.pipe(
        ofType(ingredientOzaIdUpdate),
        switchMap((action: ReturnType<typeof ingredientOzaIdUpdate>) =>
          this.service.updateOzaId(action.id, action.ozaId).pipe(
            tap(() => this.notificationService.showMessage(messages.ingredientUpdated)),
            map((ingredient: Ingredient) => IngredientsEffects.ingredientUpdateSuccess(ingredient, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, ingredientUpdateError())),
          ),
        ),
      ),
    );
  }
}
