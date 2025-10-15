import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modal: WritableSignal<boolean> = signal<boolean>(false);

  public getState(): Signal<boolean> {
    return this.modal.asReadonly();
  }

  public openModal(): void {
    this.modal.set(true);
  }

  public reset(): void {
    this.modal.set(false);
  }
}
