import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Photo} from '../../models/photo';


@Injectable()
export class PhotoService {

  private photo: BehaviorSubject<Photo | null>;

  public constructor() {
    this.photo = new BehaviorSubject<Photo | null>(null);
  }

  public show(photo: Photo): void {
    this.photo.next(photo);
  }

  public hide(): void {
    this.photo.next(null);
  }

  public getState(): Observable<Photo | null> {
    return this.photo.asObservable();
  }
}
