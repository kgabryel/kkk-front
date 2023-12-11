import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {SeasonsService} from '../../services/seasons/seasons.service';
import {NotificationService} from '../../services/notification/notification.service';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {Router} from '@angular/router';
import {Update} from '@ngrx/entity';
import {Season} from '../../models/season';
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
  seasonUpdateSuccess
} from './actions';
import {BaseEffect} from '../BaseEffect';
import {messages} from '../../messages/seasons.messages';

@Injectable()
export class SeasonsEffects extends BaseEffect<SeasonsService> {

  loadSeasons: any;
  addSeason: any;
  deleteSeason: any;
  updateSeason: any;

  constructor(
    actions: Actions,
    seasonsService: SeasonsService,
    router: Router,
    notificationService: NotificationService
  ) {
    super(actions, notificationService, router, seasonsService);
  }

  private static seasonUpdateSuccess(season: Season, id: number) {
    const update: Update<Season> = {id, changes: season};
    return seasonUpdateSuccess({season: update});
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
  }

  private createLoadEffect() {
    this.loadSeasons = createEffect(() => this.actions.pipe(
      ofType(seasonsLoad),
      switchMap((() => this.service.getAll().pipe(
        map((seasons => seasonsLoadSuccess({seasons}))),
        catchError(error => this.error(error, seasonsLoadError()))
      )))
    ));
  }

  private createAddEffect() {
    this.addSeason = createEffect(() =>
      this.actions.pipe(
        ofType(seasonAdd),
        switchMap(action => this.service.add(action.season).pipe(
          tap(() => {
            this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.seasons));
            this.notificationService.showMessage(messages.seasonAdded);
          }),
          map((season => seasonAddSuccess({season}))),
          catchError(error => this.error(error, seasonAddError()))
        ))
      ));
  }

  private createDeleteEffect() {
    this.deleteSeason = createEffect(() => this.actions.pipe(
      ofType(seasonDelete),
      switchMap((action => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage(messages.seasonDeleted)),
        map((id => seasonDeleteSuccess({id}))),
        catchError(error => this.error(error, seasonDeleteError()))
      )))
    ));
  }

  private createUpdateEffect() {
    this.updateSeason = createEffect(() => this.actions.pipe(
      ofType(seasonUpdate),
      switchMap((action => this.service.update(action.id, action.season).pipe(
        tap(() => this.notificationService.showMessage(messages.seasonUpdated)),
        map((season => SeasonsEffects.seasonUpdateSuccess(season, action.id))),
        catchError(error => this.error(error, seasonUpdateError()))
      )))
    ));
  }
}
