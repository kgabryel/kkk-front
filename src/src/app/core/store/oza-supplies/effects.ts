import type { Action } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import type { OzaSupply } from '@/app/core/models/oza-supply';

import { messages } from '@/app/core/messages/oza.messages';
import { IngredientsService } from '@/app/core/services/ingredients.service';
import { BaseEffect } from '@/app/core/store/BaseEffect';

import { suppliesLoad, suppliesLoadError, suppliesLoadSuccess } from './actions';

@Injectable()
export class OzaSuppliesEffects extends BaseEffect<IngredientsService> {
  public loadSupplies!: Observable<Action>;
  protected readonly service: IngredientsService = inject(IngredientsService);

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
