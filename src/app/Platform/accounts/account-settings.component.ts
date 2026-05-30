import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, JwtPayload } from '../../Auth/auth/auth.service';
import { CommonModule } from '@angular/common';
import { EncryptionUtil } from '../../Core/common/CommonMethods/encryptdecrypt';
@Component({
  selector: 'app-account-settings',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
private authService = inject(AuthService);
  user:JwtPayload | null = null;
    userRoles: string[] = [];
  encStoreId!: string;
  storeID!: number;
  constructor() {
      
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user?.role) {
        this.userRoles = user.role;
        this.storeID = Number(user.StoreId);
        this.encStoreId = EncryptionUtil.encrypt(Number(user.StoreId)); // Ensure storeId is a number
      }
    });
    
  }

  onLogoutClick(){
    this.authService.logout();
  }

  
}
