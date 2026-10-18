import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FullRecipe} from '../../../../core/models/full-recipe';
import {PhotosConfig} from '../../../../config/photos.config';
import {PhotoService} from '../../../../core/services/photo/photo.service';
import {recipesRoutes} from '../../../../config/routes.config';

@Component({
  selector: 'recipes-full-recipe',
  templateUrl: './full-recipe.component.html',
  styleUrls: ['./full-recipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullRecipeComponent implements OnInit {

  @Input() public recipe: FullRecipe;
  private photoService: PhotoService;
  private activePhoto: number;

  public constructor(photoService: PhotoService) {
    this.photoService = photoService;
  }

  public ngOnInit(): void {
    this.activePhoto = 0;
  }

  public changedPhoto(index: number): void {
    this.activePhoto = index;
  }

  public showPhoto(event: any): void {
    if (event.target.nodeName === 'DIV') {
      this.photoService.show(this.recipe.photos[this.activePhoto]);
    }
  }

  public getPhoto(photoId: number): string {
    return recipesRoutes.getPhoto(this.recipe.id, photoId, PhotosConfig.medium);
  }
}
