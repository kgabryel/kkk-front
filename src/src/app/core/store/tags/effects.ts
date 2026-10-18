import type { HttpErrorResponse } from '@angular/common/http';
import type { Update } from '@ngrx/entity';
import type { Action } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import type { Tag } from '@/app/core/models/tag';

import { RoutingConfig } from '@/app/config/routing.config';
import { messages } from '@/app/core/messages/tags.messages';
import { TagsService } from '@/app/core/services/tags.service';
import { BaseEffect } from '@/app/core/store/BaseEffect';
import { PathUtils } from '@/app/core/utils/path.utils';

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
  tagUpdateSuccess,
} from './actions';

@Injectable()
export class TagsEffects extends BaseEffect<TagsService> {
  public addTag!: Observable<Action>;
  public addTagRecipe!: Observable<Action>;
  public deleteTag!: Observable<Action>;
  public loadTags!: Observable<Action>;
  public updateTag!: Observable<Action>;
  protected readonly service: TagsService = inject(TagsService);

  private static tagUpdateSuccess(tag: Tag, id: number): ReturnType<typeof tagUpdateSuccess> {
    const update: Update<Tag> = { changes: tag, id };

    return tagUpdateSuccess({ tag: update });
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
    this.createAddFromRecipeEffect();
  }

  private createAddEffect(): void {
    this.addTag = createEffect(() =>
      this.actions.pipe(
        ofType(tagAdd),
        switchMap((action: ReturnType<typeof tagAdd>) =>
          this.service.add(action.name).pipe(
            tap(() => {
              void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.tags));
              this.notificationService.showMessage(messages.tagAdded);
            }),
            map((tag: Tag) => tagAddSuccess({ tag })),
            catchError((error: HttpErrorResponse) => this.error(error, tagAddError())),
          ),
        ),
      ),
    );
  }

  private createAddFromRecipeEffect(): void {
    this.addTagRecipe = createEffect(() =>
      this.actions.pipe(
        ofType(tagAddFromRecipe),
        switchMap((action: ReturnType<typeof tagAddFromRecipe>) =>
          this.service.add(action.name).pipe(
            map((tag: Tag) => tagAddSuccess({ tag })),
            catchError((error: HttpErrorResponse) => this.error(error, tagAddError())),
          ),
        ),
      ),
    );
  }

  private createDeleteEffect(): void {
    this.deleteTag = createEffect(() =>
      this.actions.pipe(
        ofType(tagDelete),
        switchMap((action: ReturnType<typeof tagDelete>) =>
          this.service.delete(action.id).pipe(
            tap(() => this.notificationService.showMessage(messages.tagDeleted)),
            map((id: number) => tagDeleteSuccess({ id })),
            catchError((error: HttpErrorResponse) => this.error(error, tagDeleteError())),
          ),
        ),
      ),
    );
  }

  private createLoadEffect(): void {
    this.loadTags = createEffect(() =>
      this.actions.pipe(
        ofType(tagsLoad),
        switchMap(() =>
          this.service.getAll().pipe(
            map((tags: Tag[]) => tagsLoadSuccess({ tags })),
            catchError((error: HttpErrorResponse) => this.error(error, tagsLoadError())),
          ),
        ),
      ),
    );
  }

  private createUpdateEffect(): void {
    this.updateTag = createEffect(() =>
      this.actions.pipe(
        ofType(tagUpdate),
        switchMap((action: ReturnType<typeof tagUpdate>) =>
          this.service.update(action.id, action.name).pipe(
            tap(() => this.notificationService.showMessage(messages.tagUpdated)),
            map((tag: Tag) => TagsEffects.tagUpdateSuccess(tag, action.id)),
            catchError((error: HttpErrorResponse) => this.error(error, tagUpdateError())),
          ),
        ),
      ),
    );
  }
}
