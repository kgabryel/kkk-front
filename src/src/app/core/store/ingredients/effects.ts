import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {IngredientsService} from '../../services/ingredients/ingredients.service';
import {NotificationService} from '../../services/notification/notification.service';
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
  ingredientUpdateSuccess
} from './actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {Router} from '@angular/router';
import {Update} from '@ngrx/entity';
import {Ingredient} from '../../models/ingredient';
import {BaseEffect} from '../BaseEffect';
import {messages} from '../../messages/ingredients.messages';

@Injectable()
export class IngredientsEffects extends BaseEffect<IngredientsService> {

  loadIngredients: any;
  addIngredient: any;
  deleteIngredient: any;
  updateIngredientName: any;
  updateIngredientAvailable: any;
  updateIngredientOzaId: any;

  constructor(
    actions: Actions,
    ingredientsService: IngredientsService,
    router: Router,
    notificationService: NotificationService
  ) {
    super(actions, notificationService, router, ingredientsService);
  }

  private static ingredientUpdateSuccess(ingredient: Ingredient, id: number) {
    const update: Update<Ingredient> = {id, changes: ingredient};
    return ingredientUpdateSuccess({ingredient: update});
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateNameEffect();
    this.createUpdateAvailableEffect();
    this.createUpdateOzaIdEffect();
  }

  private createLoadEffect() {
    this.loadIngredients = createEffect(() => this.actions.pipe(
      ofType(ingredientsLoad),
      switchMap((() => this.service.getAll().pipe(
        map((ingredients => ingredientsLoadSuccess({ingredients}))),
        catchError(error => this.error(error, ingredientsLoadError()))
      )))
    ));
  }

  private createAddEffect() {
    this.addIngredient = createEffect(() =>
      this.actions.pipe(
        ofType(ingredientAdd),
        switchMap(action => this.service.add(action.ingredient).pipe(
          tap(() => {
            this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.ingredients));
            this.notificationService.showMessage(messages.ingredientAdded);
          }),
          map((ingredient => ingredientAddSuccess({ingredient}))),
          catchError(error => this.error(error, ingredientAddError()))
        ))
      ));
  }

  private createDeleteEffect() {
    this.deleteIngredient = createEffect(() => this.actions.pipe(
      ofType(ingredientDelete),
      switchMap((action => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage(messages.ingredientDeleted)),
        map((id => ingredientDeleteSuccess({id}))),
        catchError(error => this.error(error, ingredientDeleteError()))
      )))
    ));
  }

  private createUpdateNameEffect() {
    this.updateIngredientName = createEffect(() => this.actions.pipe(
      ofType(ingredientNameUpdate),
      switchMap((action => this.service.updateName(action.id, action.name).pipe(
        tap(() => this.notificationService.showMessage(messages.ingredientUpdated)),
        map((ingredient => IngredientsEffects.ingredientUpdateSuccess(ingredient, action.id))),
        catchError(error => this.error(error, ingredientUpdateError()))
      )))
    ));
  }

  private createUpdateOzaIdEffect() {
    this.updateIngredientOzaId = createEffect(() => this.actions.pipe(
      ofType(ingredientOzaIdUpdate),
      switchMap((action => this.service.updateOzaId(action.id, action.ozaId).pipe(
        tap(() => this.notificationService.showMessage(messages.ingredientUpdated)),
        map((ingredient => IngredientsEffects.ingredientUpdateSuccess(ingredient, action.id))),
        catchError(error => this.error(error, ingredientUpdateError()))
      )))
    ));
  }

  private createUpdateAvailableEffect() {
    this.updateIngredientAvailable = createEffect(() => this.actions.pipe(
      ofType(ingredientAvailableUpdate),
      switchMap((action => this.service.updateAvailable(action.id, action.available).pipe(
        tap(() => this.notificationService.showMessage(messages.ingredientUpdated)),
        map((ingredient => IngredientsEffects.ingredientUpdateSuccess(ingredient, action.id))),
        catchError(error => this.error(error, ingredientUpdateError()))
      )))
    ));
  }
}
