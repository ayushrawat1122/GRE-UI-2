import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {
otpForm: FormGroup;
  otpControls = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'];
  formSubmitted = false;
  private authService = inject(AuthService); 
  private tosterService = inject(ToastrService); 
  constructor(private fb: FormBuilder,private router: Router) {
    this.otpForm = this.fb.group({});
    this.otpControls.forEach(ctrl =>
      this.otpForm.addControl(ctrl, this.fb.control('', [Validators.required, Validators.pattern(/^[0-9]$/)]))
    );
  }

  moveToNext(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && index < this.otpControls.length - 1) {
      const nextInput = input.nextElementSibling;
      if (nextInput) nextInput.focus();
    }
  }

  moveToPrevious(event: any, index: number) {
    const input = event.target;
    if (!input.value && index > 0) {
      const prevInput = input.previousElementSibling;
      if (prevInput) prevInput.focus();
    }
  }

  allowOnlyNumber(event: KeyboardEvent) {
  const charCode = event.key;
  if (!/^\d$/.test(charCode)) {
    event.preventDefault();
  }
}
  onOtpSubmit() {
    this.formSubmitted = true;
    if (this.otpForm.valid) {
      const otp = this.otpControls.map(ctrl => this.otpForm.get(ctrl)?.value).join('');
      let email = JSON.parse(sessionStorage.getItem('Email')!);
      if(email){
        const otpObject = {
          email: email,
          otp: otp
        }
        this.authService.verifyOtp(otpObject).subscribe((res:any)=>{
          if(res.statusCode==200){
            
            sessionStorage.clear();
            this.authService.setToken(res.accessToken,res.refreshToken);
            this.router.navigateByUrl('/dashboard/home');
          }
          else{
              
            this.tosterService.error(res.message);
          }
        });
        
      }
      else{
        this.otpForm.markAllAsTouched();
      }
    }
  }
}
