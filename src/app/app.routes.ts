import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appConfig } from './app.config';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Auth/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Platform/dashboard/dashboard.module').then(m => m.DashboardModule)
  }

];



