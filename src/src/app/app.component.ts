import type { Event } from '@angular/router';

import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SignalUtils } from './core/utils/signal.utils';
import { LoaderComponent } from './modules/shared/components/loader/loader.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, LoaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public isLoading = signal(false);

  public constructor() {
    const router = inject(Router);

    SignalUtils.reactToSignalValue<NavigationStart | NavigationEnd | undefined>(
      toSignal(
        router.events.pipe(
          filter((event: Event) => event instanceof NavigationStart || event instanceof NavigationEnd),
        ),
      ),
      (event: NavigationStart | NavigationEnd | undefined) => {
        if (event === undefined) {
          return;
        }
        this.isLoading.set(event instanceof NavigationStart);
      },
    );
  }
}
