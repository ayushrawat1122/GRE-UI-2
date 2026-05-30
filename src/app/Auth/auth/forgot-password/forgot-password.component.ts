import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  currentYear: number = new Date().getFullYear();
  private authService = inject(AuthService);
  private toasterService = inject(ToastrService);
  private router = inject(Router);

  onSubmit() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!this.email) {
      return;
    }

    if (!emailPattern.test(this.email)) {
      return;
    }

    const forgotPasswordObject = {
      email: this.email,
      oldPasswod: '',
      newPassword: ''
    };

    this.authService.forgotPassword(forgotPasswordObject).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.toasterService.success(res.message);
        this.router.navigate(['/']);
      }
      else {
        this.toasterService.error(res.message);
      }
    });
  }

}
