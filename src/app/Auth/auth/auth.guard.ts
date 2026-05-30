import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');

  // Allow if we have access OR refresh token (refresh will happen via interceptor)
  if (accessToken || refreshToken) {
    return true;
  }

  // Only unauthenticated users go to login
  router.navigateByUrl('/', { replaceUrl: true });
  return false;
};
export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');

  if ((accessToken || refreshToken) && state.url === '/') {
    router.navigateByUrl('/dashboard/home', { replaceUrl: true });
    return false;
  }

  return true;
};

// export const isLoginUser: CanActivateFn = (route, state) => {
    
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const user = authService.getUser()// should return user info + roles
//   if(user==null){
//     router.navigate(['/']);
//     return false;
//   }
//   // Read roles from route data
  

//   return true; 
// };

export const canHavePromoOrderScreenPermission: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');

  if (!accessToken && refreshToken) {
    return true; // allow refresh window
  }
  
  const user = authService.getUser();
  if (!user) {
    router.navigateByUrl('/', { replaceUrl: true });
    return false;
  }

  const canAccess = user?.role?.includes('CanOrderPromoProducts');
  if (!canAccess) {
    router.navigateByUrl('/dashboard/unauthorize', { replaceUrl: true });
    return false;
  }

  return true;
};

export const canHaveOrderScreenPermission: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');

  // ⏳ Allow navigation while refresh token exists (interceptor will refresh)
  if (!accessToken && refreshToken) {
    return true;
  }

  const user = authService.getUser();
  if (!user) {
    router.navigateByUrl('/', { replaceUrl: true });
    return false;
  }

  const canAccess = user?.role?.includes('CanOrderSalesProducts');
  if (!canAccess) {
    router.navigateByUrl('/dashboard/unauthorize', { replaceUrl: true });
    return false;
  }

  return true;
};

// CanViewOrderHistory"

export const canHaveOrderHistoryScreenPermission: CanActivateFn = (route, state) => {
    
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser()// should return user info + roles
 if(user==null){
    router.navigate(['/']);
    return false;
  }
  // Read roles from route data
  var canAccess = user?.role?.includes('CanViewOrderHistory');
  if (!canAccess) {
    // Redirect to unauthorized page or home
    router.navigate(['/dashboard/unauthorize']); // change path if needed
    return false; 
  }

  return true; 
};



export const canHavePromoOrderHistoryScreenPermission: CanActivateFn = (route, state) => {
    
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser()// should return user info + roles
 if(user==null){
    router.navigate(['/']);
    return false;
  }
  // Read roles from route data
  var canAccess = user?.role?.includes('CanViewPromoOrderHistory');
  if (!canAccess) {
    // Redirect to unauthorized page or home
    router.navigate(['/dashboard/unauthorize']); // change path if needed
    return false; 
  }

  return true; 
};



export const onlyApplicationAdmin: CanActivateFn = (route, state) => {
    
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser()// should return user info + roles

  // Read roles from route data
 if(user==null){
    router.navigate(['/']);
    return false;
  }
  if (user?.StoreId !== '0') {
    // Redirect to unauthorized page or home
    router.navigate(['/dashboard/unauthorize']); // change path if needed
    return false; 
  }

  return true; 
};