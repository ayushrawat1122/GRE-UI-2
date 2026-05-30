import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
showPassword = false;
  currentYear: number = new Date().getFullYear();


  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', Validators.required]
    });
    this.loginForm.reset();
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
       
      let email = this.loginForm.get('email')?.value;
      let password = this.loginForm.get('password')?.value;
       const loginObject = {
        email:email,
        password:password
      };
      this.authService.loginUser(loginObject).subscribe((res:any)=>{
        if(res.statusCode==200){
          if(res.data.mfaEnabled){
            
            sessionStorage.clear();
            sessionStorage.setItem('Email',JSON.stringify(email));
            this.router.navigateByUrl('/otp');
          }
          else{
              this.authService.setToken(res.accessToken,res.refreshToken);
              this.router.navigate(['/dashboard/home'])
          }
        }
        else{
          this.toastr.error(res.message);
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
      // Optional: Display error messages if form is invalid
    }
  }
  togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}
}
