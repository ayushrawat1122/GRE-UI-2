import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { authGuard, loginGuard } from './auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent,
    canActivate:[loginGuard]
  },
  {
    path:'otp',
    component:OtpComponent,
    canActivate:[loginGuard]
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent,
    canActivate:[loginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
