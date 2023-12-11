import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
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
  recipeUpdateSuccess
} from './actions';
import {Update} from '@ngrx/entity';
import {Recipe} from '../../models/recipe';
import {RecipesService} from '../../services/recipes/recipes.service';
import {NotificationService} from '../../services/notification/notification.service';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {BaseEffect} from '../BaseEffect';
import {messages} from '../../messages/recipes.messages';


@Injectable()
export class RecipesEffects extends BaseEffect<RecipesService> {

  loadRecipes: any;
  addRecipe: any;
  deleteRecipe: any;
  updateRecipe: any;
  updateRecipeFavourite: any;
  updateRecipeToDo: any;
  addPhoto: any;
  photosReorder: any;
  deletePhoto: any;

  constructor(
    actions: Actions,
    recipesService: RecipesService,
    router: Router,
    notificationService: NotificationService
  ) {
    super(actions, notificationService, router, recipesService);
  }

  private static recipeUpdateSuccess(recipe: Recipe, id: number) {
    const update: Update<Recipe> = {id, changes: recipe};
    return recipeUpdateSuccess({recipe: update});
  }

  private static photoAddSuccess(recipe: Recipe, id: number) {
    const update: Update<Recipe> = {id, changes: recipe};
    return photoAddSuccess({recipe: update});
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

  private createLoadEffect() {
    this.loadRecipes = createEffect(() => this.actions.pipe(
      ofType(recipesLoad),
      switchMap((() => this.service.getAll().pipe(
        map((recipes => recipesLoadSuccess({recipes})))
      ))),
      catchError(error => this.error(error, recipesLoadError()))
    ));
  }

  private createAddEffect() {
    this.addRecipe = createEffect(() =>
      this.actions.pipe(
        ofType(recipeAdd),
        switchMap(action => this.service.add(action.recipe).pipe(
          tap(recipe => {
            this.router.navigateByUrl(PathUtils.bindParams(
              PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipe),
              new Map([['id', recipe.id.toString()]])
            ));
            this.notificationService.showMessage(messages.recipeAdded);
          }),
          map((recipe => recipeAddSuccess({recipe}))),
          catchError(error => this.error(error, recipeAddError()))
        ))
      ));
  }

  private createAddPhotoEffect() {
    this.addPhoto = createEffect(() => this.actions.pipe(
      ofType(photoAdd),
      switchMap((action => this.service.addPhoto(action.id, {photo: action.photo}).pipe(
        tap(recipe => this.notificationService.showMessage(messages.photoAdded)),
        map((recipe => RecipesEffects.photoAddSuccess(recipe, action.id))),
        catchError(error => this.error(error, photoAddError()))
      )))
    ));
  }

  private createDeleteEffect() {
    this.deleteRecipe = createEffect(() => this.actions.pipe(
      ofType(recipeDelete),
      switchMap((action => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage(messages.recipeDeleted)),
        map((id => recipeDeleteSuccess({id}))),
        catchError(error => this.error(error, recipeDeleteError()))
      )))
    ));
  }

  private createUpdateFavouriteEffect() {
    this.updateRecipeFavourite = createEffect(() => this.actions.pipe(
      ofType(recipeFavouriteUpdate),
      switchMap((action => this.service.updateFavourite(action.id, action.favourite).pipe(
        tap(() => this.notificationService.showMessage(messages.recipeUpdated)),
        map((recipe => RecipesEffects.recipeUpdateSuccess(recipe, action.id))),
        catchError(error => this.error(error, recipeUpdateError()))
      )))
    ));
  }

  private createUpdateToDoEffect() {
    this.updateRecipeToDo = createEffect(() => this.actions.pipe(
      ofType(recipeToDoUpdate),
      switchMap((action => this.service.updateToDo(action.id, action.toDo).pipe(
        tap(() => this.notificationService.showMessage(messages.recipeUpdated)),
        map((recipe => RecipesEffects.recipeUpdateSuccess(recipe, action.id))),
        catchError(error => this.error(error, recipeUpdateError()))
      )))
    ));
  }

  private createUpdateEffect() {
    this.updateRecipe = createEffect(() => this.actions.pipe(
      ofType(recipeUpdate),
      switchMap((action => this.service.update(action.id, action.recipe).pipe(
        tap(recipe => {
          this.router.navigateByUrl(PathUtils.bindParams(
            PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.recipe),
            new Map([['id', recipe.id.toString()]])
          ));
          this.notificationService.showMessage(messages.recipeUpdated);
        }),
        map((recipe => RecipesEffects.recipeUpdateSuccess(recipe, action.id))),
        catchError(error => this.error(error, recipeUpdateError()))
      )))
    ));
  }

  private createPhotosReorderEffect() {
    this.photosReorder = createEffect(() => this.actions.pipe(
      ofType(photosReorder),
      switchMap((action => this.service.reorderPhotos(action.id, action.order).pipe(
        tap(() => this.notificationService.showMessage(messages.photosReordered)),
        map((recipe => RecipesEffects.recipeUpdateSuccess(recipe, action.id))),
        catchError(error => this.error(error, recipeUpdateError()))
      )))
    ));
  }

  private createDeletePhotoEffect() {
    this.deletePhoto = createEffect(() => this.actions.pipe(
      ofType(photoDelete),
      switchMap((action => this.service.deletePhoto(action.recipeId, action.photoId).pipe(
        tap(() => this.notificationService.showMessage(messages.photoDeleted)),
        map((recipe => RecipesEffects.recipeUpdateSuccess(recipe, action.recipeId))),
        catchError(error => this.error(error, recipeUpdateError()))
      )))
    ));
  }
}
