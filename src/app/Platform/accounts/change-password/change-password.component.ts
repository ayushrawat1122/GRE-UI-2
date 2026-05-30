import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { AccountService } from '../Services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
interface ChangePasswordForm {
  currentPassword: AbstractControl;
  newPassword: AbstractControl;
  confirmNewPassword: AbstractControl;
  confirmCheckbox: AbstractControl;
}
@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup;
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private toasterService = inject(ToastrService);
  private router = inject(Router);
  user: JwtPayload | null = null;
showCurrentPassword = false;
showNewPassword = false;
showConfirmPassword = false;
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });



    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmNewPassword: ['', Validators.required],
      confirmCheckbox: [false, Validators.requiredTrue]
    }, {
      validators: this.matchPasswords
    });
  }



  get f() {
    return this.changePasswordForm.controls;
  }
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasNumber && hasSpecialChar;
    return valid ? null : { passwordStrength: true };
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const passwordObject = {
        email: this.user?.email,
        oldPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value
      }

      this.accountService.changePassword(passwordObject).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.toasterService.success(res.message);
          this.authService.logout()
        }
        else {
          this.toasterService.error(res.message);
        }
      })
    }
    else {
      this.changePasswordForm.markAllAsTouched();
    }

    
  }
}
