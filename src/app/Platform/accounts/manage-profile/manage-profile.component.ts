import { Component, inject } from '@angular/core';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../Services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './manage-profile.component.html',
  styleUrl: './manage-profile.component.css'
})
export class ManageProfileComponent {
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  storeName: string = ''
  user: JwtPayload | null = null;
  updateUserForm!: FormGroup;
  isConfirmed: boolean = false;

  constructor(private fb: FormBuilder, private toastrService: ToastrService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.updateUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), Validators.maxLength(100)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      confirmCheckbox: [false, Validators.requiredTrue]

    });
    this.patchUser();

  }

  patchUser() {
    if (this.user) {
      this.updateUserForm.patchValue({
        email: this.user.email || '',
        firstName: this.user.FirstName || '',
        lastName: this.user.LastName || '',
        confirmCheckbox: false
      });
    }
  }

  onUpdateUserProfile() {
      


    if (this.updateUserForm.valid) {

      if (this.user?.FirstName === this.updateUserForm.get('firstName')?.value && this.user?.LastName === this.updateUserForm.get('lastName')?.value) {
        return
      }

      const updatedUser = {
        ...this.user,
        email: this.updateUserForm.get('email')?.value,
        FirstName: this.updateUserForm.get('firstName')?.value,
        LastName: this.updateUserForm.get('lastName')?.value
      };

      this.accountService.changeUserName(updatedUser).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success(res.message)
          this.isConfirmed = false;
          this.authService.generateAccessTokenFromRefreshToken(sessionStorage.getItem('refreshToken') || '').subscribe((res: any) => {
            if (res.statusCode == 200) {
              this.authService.setToken(res.accessToken, res.refreshToken);
              let user = this.authService.decodeToken(res.accessToken) as JwtPayload;
              this.authService.setUser(user);
              this.updateUserForm.get('confirmCheckbox')?.setValue(false);
              Object.keys(this.updateUserForm.controls).forEach((key) => {
                const control = this.updateUserForm.get(key);
                control?.markAsPristine();
                control?.markAsUntouched();
              });
            } else {
              this.toastrService.error(res.message)

            }
          })
        } else {
          this.toastrService.error(res.message);
        }
      });
    } else {
      this.updateUserForm.markAllAsTouched();
    }


  }

}
