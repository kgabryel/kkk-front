import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { messages } from '../../messages/oza.messages';
import { OzaSupply } from '../../models/oza-supply';
import { IngredientsService } from '../../services/ingredients.service';
import { NotificationService } from '../../services/notification.service';
import { BaseEffect } from '../BaseEffect';
import { suppliesLoad, suppliesLoadError, suppliesLoadSuccess } from './actions';

@Injectable()
export class OzaSuppliesEffects extends BaseEffect<IngredientsService> {
  public loadSupplies!: Observable<Action>;
  public constructor(
    actions: Actions,
    ingredientsService: IngredientsService,
    router: Router,
    notificationService: NotificationService,
  ) {
    super(actions, notificationService, router, ingredientsService);
  }

  protected initEffects(): void {
    this.createLoadEffect();
  }

  protected onError(): Observable<Action> {
    this.notificationService.showErrorMessage(messages.downloadError);

    return of(suppliesLoadError());
  }

  private createLoadEffect(): void {
    this.loadSupplies = createEffect(() =>
      this.actions.pipe(
        ofType(suppliesLoad),
        switchMap(() =>
          this.service.getOzaSupplies().pipe(
            map((supplies: OzaSupply[]) => suppliesLoadSuccess({ supplies })),
            catchError(() => this.onError()),
          ),
        ),
      ),
    );
  }
}
