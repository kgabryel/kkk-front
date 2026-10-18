import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { Photo } from '../models/photo';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private photo: WritableSignal<Photo | null> = signal<Photo | null>(null);

  public getState(): Signal<Photo | null> {
    return this.photo.asReadonly();
  }

  public hide(): void {
    this.photo.set(null);
  }

  public show(photo: Photo): void {
    this.photo.set(photo);
  }
}
