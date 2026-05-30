import { Component, inject, OnInit } from '@angular/core';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { Product } from '../products/products.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  storeName: string = 'Default Store';
  user:JwtPayload | null = null;
  featuredProduct: Product | null = null;
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);

  constructor() {
    
  }
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user 
      this.storeName = user?.StoreName || 'Hi Admin';
    });
        this.getFeaturedProduct();

  }
  

  getFeaturedProduct() {
    this.dashboardService.getFeaturedProduct().subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.featuredProduct = res.data as Product || null;
        this.featuredProduct = {
          ...this.featuredProduct,
          productBase64: `data:image/jpeg;base64,${this.featuredProduct?.productBase64}`,
        }
      }
      else {
        this.featuredProduct = res.data || null;
      }
    })
  }
}
