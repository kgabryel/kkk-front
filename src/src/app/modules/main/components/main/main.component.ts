import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

import { BaseComponent } from '../../../base.component';
import { BottomMenuComponent } from '../../../layout/components/bottom-menu/bottom-menu.component';
import { HeaderComponent } from '../../../layout/components/header/header.component';
import { UpperMenuComponent } from '../../../layout/components/upper-menu/upper-menu.component';
import { TimersComponent } from '../../../timers/components/timers/timers.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpperMenuComponent,
    HeaderComponent,
    RouterOutlet,
    BottomMenuComponent,
    TimersComponent,
  ],
  selector: 'main-main',
  standalone: true,
  styleUrls: ['./main.component.scss'],
  templateUrl: './main.component.html',
})
export class MainComponent extends BaseComponent implements OnInit {
  private router: Router;
  public constructor(router: Router) {
    super();
    this.router = router;
  }

  public ngOnInit(): void {
    this.onObservable(
      () => window.scroll({ behavior: 'smooth', left: 0, top: 0 }),
      this.router.events.pipe(
        filter((evt: Event): evt is NavigationEnd => evt instanceof NavigationEnd),
      ),
    );
  }
}
