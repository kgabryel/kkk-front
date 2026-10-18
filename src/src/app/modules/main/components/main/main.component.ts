import type { OnInit } from '@angular/core';
import type { Event } from '@angular/router';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { BaseComponent } from '@/app/modules/base.component';
import { BottomMenuComponent } from '@/app/modules/layout/components/bottom-menu/bottom-menu.component';
import { HeaderComponent } from '@/app/modules/layout/components/header/header.component';
import { UpperMenuComponent } from '@/app/modules/layout/components/upper-menu/upper-menu.component';
import { TimersComponent } from '@/app/modules/timers/components/timers/timers.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperMenuComponent, HeaderComponent, RouterOutlet, BottomMenuComponent, TimersComponent],
  selector: 'main-main',
  styleUrl: './main.component.scss',
  templateUrl: './main.component.html',
})
export class MainComponent extends BaseComponent implements OnInit {
  private router: Router = inject(Router);

  public ngOnInit(): void {
    this.onObservable(
      () => window.scroll({ behavior: 'smooth', left: 0, top: 0 }),
      this.router.events.pipe(filter((evt: Event): evt is NavigationEnd => evt instanceof NavigationEnd)),
    );
  }
}
