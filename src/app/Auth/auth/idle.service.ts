import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
private timeoutId: any;
    private readonly IDLE_TIME = environment.idleTimeoutMs;


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private zone: NgZone
  ) {}

  startWatching() {
    this.zone.runOutsideAngular(() => {
      ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event => {
        window.addEventListener(event, this.resetTimer.bind(this), true);
      });
    });

    this.resetTimer();
  }

  stopWatching() {
    clearTimeout(this.timeoutId);
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.zone.run(() => {
        sessionStorage.clear();
        this.toastr.info('You were logged out due to inactivity.');
        this.router.navigate(['/']);
      });
    }, this.IDLE_TIME);
  }
}
