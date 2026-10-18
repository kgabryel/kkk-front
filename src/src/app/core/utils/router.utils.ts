import type { Injector, Signal } from '@angular/core';
import type { Router } from '@angular/router';

import { runInInjectionContext } from '@angular/core';

import { RoutingConfig } from '@/app/config/routing.config';

import { PathUtils } from './path.utils';
import { SignalUtils } from './signal.utils';

export class RouterUtils {
  public static redirectIfMissing<T>(injector: Injector, model: Signal<T | undefined>, router: Router): void {
    runInInjectionContext(injector, () =>
      SignalUtils.reactToSignalValue(model, (recipe: T | undefined) => {
        if (recipe === undefined) {
          void router.navigateByUrl(PathUtils.concatPath(RoutingConfig.notFound), {
            skipLocationChange: true,
          });
        }
      }),
    );
  }
}
