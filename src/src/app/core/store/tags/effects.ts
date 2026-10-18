import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {TagsService} from '../../services/tags/tags.service';
import {NotificationService} from '../../services/notification/notification.service';
import {
  tagAdd,
  tagAddError,
  tagAddFromRecipe,
  tagAddSuccess,
  tagDelete,
  tagDeleteError,
  tagDeleteSuccess,
  tagsLoad,
  tagsLoadError,
  tagsLoadSuccess,
  tagUpdate,
  tagUpdateError,
  tagUpdateSuccess
} from './actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {Router} from '@angular/router';
import {Update} from '@ngrx/entity';
import {Tag} from '../../models/tag';
import {BaseEffect} from '../BaseEffect';
import {messages} from '../../messages/tags.messages';

@Injectable()
export class TagsEffects extends BaseEffect<TagsService> {

  loadTags: any;
  addTag: any;
  deleteTag: any;
  updateTag: any;
  addTagRecipe: any;

  constructor(actions: Actions, tagsService: TagsService, router: Router, notificationService: NotificationService) {
    super(actions, notificationService, router, tagsService);
  }

  private static tagUpdateSuccess(tag: Tag, id: number) {
    const update: Update<Tag> = {id, changes: tag};
    return tagUpdateSuccess({tag: update});
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
    this.createAddFromRecipeEffect();
  }

  private createLoadEffect() {
    this.loadTags = createEffect(() => this.actions.pipe(
      ofType(tagsLoad),
      switchMap((() => this.service.getAll().pipe(
        map((tags => tagsLoadSuccess({tags}))),
        catchError(error => this.error(error, tagsLoadError()))
      )))
    ));
  }

  private createAddFromRecipeEffect() {
    this.addTagRecipe = createEffect(() =>
      this.actions.pipe(
        ofType(tagAddFromRecipe),
        switchMap(action => this.service.add(action.name).pipe(
          map((tag => tagAddSuccess({tag}))),
          catchError(error => this.error(error, tagAddError()))
        ))
      ));
  }

  private createAddEffect() {
    this.addTag = createEffect(() =>
      this.actions.pipe(
        ofType(tagAdd),
        switchMap(action => this.service.add(action.name).pipe(
          tap(() => {
            this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.tags));
            this.notificationService.showMessage(messages.tagAdded);
          }),
          map((tag => tagAddSuccess({tag}))),
          catchError(error => this.error(error, tagAddError()))
        ))
      ));
  }

  private createDeleteEffect() {
    this.deleteTag = createEffect(() => this.actions.pipe(
      ofType(tagDelete),
      switchMap((action => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage(messages.tagDeleted)),
        map((id => tagDeleteSuccess({id}))),
        catchError(error => this.error(error, tagDeleteError()))
      )))
    ));
  }

  private createUpdateEffect() {
    this.updateTag = createEffect(() => this.actions.pipe(
      ofType(tagUpdate),
      switchMap((action => this.service.update(action.id, action.name).pipe(
        tap(() => this.notificationService.showMessage(messages.tagUpdated)),
        map((tag => TagsEffects.tagUpdateSuccess(tag, action.id))),
        catchError(error => this.error(error, tagUpdateError()))
      )))
    ));
  }
}
