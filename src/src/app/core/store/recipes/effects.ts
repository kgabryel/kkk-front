import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { RoutingConfig } from '../../../config/routing.config';
import { messages } from '../../messages/recipes.messages';
import { Recipe } from '../../models/recipe';
import { NotificationService } from '../../services/notification.service';
import { RecipesService } from '../../services/recipes.service';
import { PathUtils } from '../../utils/path.utils';
import { BaseEffect } from '../BaseEffect';
import {
  photoAdd,
  photoAddError,
  photoAddSuccess,
  photoDelete,
  photosReorder,
  recipeAdd,
  recipeAddError,
  recipeAddSuccess,
  recipeDelete,
  recipeDeleteError,
  recipeDeleteSuccess,
  recipeFavouriteUpdate,
  recipesLoad,
  recipesLoadError,
  recipesLoadSuccess,
  recipeToDoUpdate,
  recipeUpdate,
  recipeUpdateError,
  recipeUpdateSuccess,
} from './actions';

@Injectable()
export class RecipesEffects extends BaseEffect<RecipesService> {
  public addPhoto!: Observable<Action>;
  public addRecipe!: Observable<Action>;
  public deletePhoto!: Observable<Action>;
  public deleteRecipe!: Observable<Action>;
  public loadRecipes!: Observable<Action>;
  public photosReorder!: Observable<Action>;
  public updateRecipe!: Observable<Action>;
  public updateRecipeFavourite!: Observable<Action>;
  public updateRecipeToDo!: Observable<Action>;
  public constructor(
    actions: Actions,
    recipesService: RecipesService,
    router: Router,
    notificationService: NotificationService,
  ) {
    super(actions, notificationService, router, recipesService);
  }

  private static photoAddSuccess(recipe: Recipe, id: number): ReturnType<typeof photoAddSuccess> {
    const update: Update<Recipe> = { changes: recipe, id };

    return photoAddSuccess({ recipe: update });
  }

  private static recipeUpdateSuccess(
    recipe: Recipe,
    id: number,
  ): ReturnType<typeof recipeUpdateSuccess> {
    const update: Update<Recipe> = { changes: recipe, id };

    return recipeUpdateSuccess({ recipe: update });
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateFavouriteEffect();
    this.createUpdateToDoEffect();
    this.createUpdateEffect();
    this.createAddPhotoEffect();
    this.createPhotosReorderEffect();
    this.createDeletePhotoEffect();
  }

  private createAddEffect(): void {
    this.addRecipe = createEffect(() =>
      this.actions.pipe(
        ofType(recipeAdd),
        switchMap((action: ReturnType<typeof recipeAdd>) =>
          this.service.add(action.recipe).pipe(
            tap((recipe: Recipe) => {
              void this.router.navigateByUrl(
                PathUtils.bindParams(
                  PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipe),
                  new Map([['id', recipe.id.toString()]]),
                ),
              );
              this.notificationService.showMessage(messages.recipeAdded);
            }),
            map((recipe: Recipe) => recipeAddSuccess({ recipe })),
            catchError((error: HttpErrorResponse) => this.error(error, recipeAddError())),
          ),
        ),
      ),
    );
  }

  private createAddPhotoEffect(): void {
    this.addPhoto = createEffect(() =>
      this.actions.pipe(
        ofType(photoAdd),
        switchMap((action: ReturnType<typeof photoAdd>) =>
          this.service.addPhoto(action.id, { photo: action.photo }).pipe(
            tap(() => this.notificationService.showMessage(messages.photoAdded)),
            map((recipe: Recipe) => RecipesEffects.photoAddSuccess(recipe, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, photoAddError())),
          ),
        ),
      ),
    );
  }

  private createDeleteEffect(): void {
    this.deleteRecipe = createEffect(() =>
      this.actions.pipe(
        ofType(recipeDelete),
        switchMap((action: ReturnType<typeof recipeDelete>) =>
          this.service.delete(action.id).pipe(
            tap(() => this.notificationService.showMessage(messages.recipeDeleted)),
            map((id: number) => recipeDeleteSuccess({ id })),
            catchError((error: HttpErrorResponse) => this.error(error, recipeDeleteError())),
          ),
        ),
      ),
    );
  }

  private createDeletePhotoEffect(): void {
    this.deletePhoto = createEffect(() =>
      this.actions.pipe(
        ofType(photoDelete),
        switchMap((action: ReturnType<typeof photoDelete>) =>
          this.service.deletePhoto(action.recipeId, action.photoId).pipe(
            tap(() => this.notificationService.showMessage(messages.photoDeleted)),
            map((recipe: Recipe) => RecipesEffects.recipeUpdateSuccess(recipe, action.recipeId)),
            catchError((error: HttpErrorResponse) => this.error(error, recipeUpdateError())),
          ),
        ),
      ),
    );
  }

  private createLoadEffect(): void {
    this.loadRecipes = createEffect(() =>
      this.actions.pipe(
        ofType(recipesLoad),
        switchMap(() =>
          this.service.getAll().pipe(map((recipes: Recipe[]) => recipesLoadSuccess({ recipes }))),
        ),
        catchError((error: HttpErrorResponse) => this.error(error, recipesLoadError())),
      ),
    );
  }

  private createPhotosReorderEffect(): void {
    this.photosReorder = createEffect(() =>
      this.actions.pipe(
        ofType(photosReorder),
        switchMap((action: ReturnType<typeof photosReorder>) =>
          this.service.reorderPhotos(action.id, action.order).pipe(
            tap(() => this.notificationService.showMessage(messages.photosReordered)),
            map((recipe: Recipe) => RecipesEffects.recipeUpdateSuccess(recipe, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, recipeUpdateError())),
          ),
        ),
      ),
    );
  }

  private createUpdateEffect(): void {
    this.updateRecipe = createEffect(() =>
      this.actions.pipe(
        ofType(recipeUpdate),
        switchMap((action: ReturnType<typeof recipeUpdate>) =>
          this.service.update(action.id, action.recipe).pipe(
            tap((recipe: Recipe) => {
              void this.router.navigateByUrl(
                PathUtils.bindParams(
                  PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipe),
                  new Map([['id', recipe.id.toString()]]),
                ),
              );
              this.notificationService.showMessage(messages.recipeUpdated);
            }),
            map((recipe: Recipe) => RecipesEffects.recipeUpdateSuccess(recipe, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, recipeUpdateError())),
          ),
        ),
      ),
    );
  }

  private createUpdateFavouriteEffect(): void {
    this.updateRecipeFavourite = createEffect(() =>
      this.actions.pipe(
        ofType(recipeFavouriteUpdate),
        switchMap((action: ReturnType<typeof recipeFavouriteUpdate>) =>
          this.service.updateFavourite(action.id, action.favourite).pipe(
            tap(() => this.notificationService.showMessage(messages.recipeUpdated)),
            map((recipe: Recipe) => RecipesEffects.recipeUpdateSuccess(recipe, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, recipeUpdateError())),
          ),
        ),
      ),
    );
  }

  private createUpdateToDoEffect(): void {
    this.updateRecipeToDo = createEffect(() =>
      this.actions.pipe(
        ofType(recipeToDoUpdate),
        switchMap((action: ReturnType<typeof recipeToDoUpdate>) =>
          this.service.updateToDo(action.id, action.toDo).pipe(
            tap(() => this.notificationService.showMessage(messages.recipeUpdated)),
            map((recipe: Recipe) => RecipesEffects.recipeUpdateSuccess(recipe, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, recipeUpdateError())),
          ),
        ),
      ),
    );
  }
}
