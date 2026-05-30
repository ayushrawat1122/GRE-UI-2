import { Component } from '@angular/core';
import { HeaderComponent } from '../../Core/common/header/header.component';
import { FooterComponent } from '../../Core/common/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,HeaderComponent,FooterComponent,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
}
