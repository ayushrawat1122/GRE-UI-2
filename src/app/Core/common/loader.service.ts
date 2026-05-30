import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
private requestCount = 0;
  isLoading = new BehaviorSubject<boolean>(false);

  show() {
    this.requestCount++;
    if (this.requestCount === 1) this.isLoading.next(true);
  }

  hide() {
    this.requestCount--;
    if (this.requestCount === 0) this.isLoading.next(false);
  }
}
