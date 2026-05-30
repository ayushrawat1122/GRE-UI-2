import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { Subscription, take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
//   private authService = inject(AuthService);
//   user:JwtPayload | null = null;
//   constructor() {
//     this.authService.user$.pipe(take(1)).subscribe(user => {
//            this.user = user;
//          });
    
//   }
//   OnInit(): void {
//   }
// logout(){
   
// this.authService.logout();  
// }
 private authService = inject(AuthService);
  private sub!: Subscription;

  user: JwtPayload | null = null;

  ngOnInit(): void {
    this.sub = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
