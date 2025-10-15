import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { RoutingConfig } from '../../../config/routing.config';
import { messages } from '../../messages/seasons.messages';
import { Season } from '../../models/season';
import { NotificationService } from '../../services/notification.service';
import { SeasonsService } from '../../services/seasons.service';
import { PathUtils } from '../../utils/path.utils';
import { BaseEffect } from '../BaseEffect';
import {
  seasonAdd,
  seasonAddError,
  seasonAddSuccess,
  seasonDelete,
  seasonDeleteError,
  seasonDeleteSuccess,
  seasonsLoad,
  seasonsLoadError,
  seasonsLoadSuccess,
  seasonUpdate,
  seasonUpdateError,
  seasonUpdateSuccess,
} from './actions';

@Injectable()
export class SeasonsEffects extends BaseEffect<SeasonsService> {
  public addSeason!: Observable<Action>;
  public deleteSeason!: Observable<Action>;
  public loadSeasons!: Observable<Action>;
  public updateSeason!: Observable<Action>;
  public constructor(
    actions: Actions,
    seasonsService: SeasonsService,
    router: Router,
    notificationService: NotificationService,
  ) {
    super(actions, notificationService, router, seasonsService);
  }

  private static seasonUpdateSuccess(
    season: Season,
    id: number,
  ): ReturnType<typeof seasonUpdateSuccess> {
    const update: Update<Season> = { changes: season, id };

    return seasonUpdateSuccess({ season: update });
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
  }

  private createAddEffect(): void {
    this.addSeason = createEffect(() =>
      this.actions.pipe(
        ofType(seasonAdd),
        switchMap((action: ReturnType<typeof seasonAdd>) =>
          this.service.add(action.season).pipe(
            tap(() => {
              void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.seasons));
              this.notificationService.showMessage(messages.seasonAdded);
            }),
            map((season: Season) => seasonAddSuccess({ season })),
            catchError((error: HttpErrorResponse) => this.error(error, seasonAddError())),
          ),
        ),
      ),
    );
  }

  private createDeleteEffect(): void {
    this.deleteSeason = createEffect(() =>
      this.actions.pipe(
        ofType(seasonDelete),
        switchMap((action: ReturnType<typeof seasonDelete>) =>
          this.service.delete(action.id).pipe(
            tap(() => this.notificationService.showMessage(messages.seasonDeleted)),
            map((id: number) => seasonDeleteSuccess({ id })),
            catchError((error: HttpErrorResponse) => this.error(error, seasonDeleteError())),
          ),
        ),
      ),
    );
  }

  private createLoadEffect(): void {
    this.loadSeasons = createEffect(() =>
      this.actions.pipe(
        ofType(seasonsLoad),
        switchMap(() =>
          this.service.getAll().pipe(
            map((seasons: Season[]) => seasonsLoadSuccess({ seasons })),
            catchError((error: HttpErrorResponse) => this.error(error, seasonsLoadError())),
          ),
        ),
      ),
    );
  }

  private createUpdateEffect(): void {
    this.updateSeason = createEffect(() =>
      this.actions.pipe(
        ofType(seasonUpdate),
        switchMap((action: ReturnType<typeof seasonUpdate>) =>
          this.service.update(action.id, action.season).pipe(
            tap(() => this.notificationService.showMessage(messages.seasonUpdated)),
            map((season: Season) => SeasonsEffects.seasonUpdateSuccess(season, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, seasonUpdateError())),
          ),
        ),
      ),
    );
  }
}
