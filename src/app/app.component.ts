import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoaderService } from './Core/common/loader.service';
import { LoaderComponent } from './Core/common/loader/loader.component';
import { IdleService } from './Auth/auth/idle.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GRE';

  constructor(private router: Router, private loader: LoaderService,private idleService: IdleService) {
    this.idleService.startWatching();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loader.show();
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loader.hide();
      }
    });
  }
}
