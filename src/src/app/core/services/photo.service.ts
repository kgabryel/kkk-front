import type { Signal, WritableSignal } from '@angular/core';

import { Injectable, signal } from '@angular/core';

import type { Photo } from '@/app/core/models/photo';

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
