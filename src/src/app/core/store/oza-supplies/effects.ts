import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {suppliesLoad, suppliesLoadError, suppliesLoadSuccess} from './actions';
import {NotificationService} from '../../services/notification/notification.service';
import {BaseEffect} from '../BaseEffect';
import {IngredientsService} from '../../services/ingredients/ingredients.service';
import {of} from 'rxjs';
import {messages} from '../../messages/oza.messages';


@Injectable()
export class OzaSuppliesEffects extends BaseEffect<IngredientsService> {

  loadSupplies: any;

  constructor(
    actions: Actions,
    ingredientsService: IngredientsService,
    router: Router,
    notificationService: NotificationService
  ) {
    super(actions, notificationService, router, ingredientsService);
  }

  protected initEffects(): void {
    this.createLoadEffect();
  }

  protected onError() {
    this.notificationService.showErrorMessage(messages.downloadError);
    return of(suppliesLoadError());
  }

  private createLoadEffect() {
    this.loadSupplies = createEffect(() => this.actions.pipe(
      ofType(suppliesLoad),
      switchMap((() => this.service.getOzaSupplies().pipe(
        map((supplies => suppliesLoadSuccess({supplies}))),
        catchError(() => this.onError())
      )))
    ));
  }
}
