import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { catchError, finalize, Observable, switchMap, BehaviorSubject, filter, take } from 'rxjs';
import { throwError } from 'rxjs';
import { LoaderService } from '../../Core/common/loader.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const loader = inject(LoaderService);
  const http = inject(HttpClient);
  const router = inject(Router);
  const toaster = inject(ToastrService);

  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = sessionStorage.getItem('refreshToken');
  const apiUrl = environment.baseUrl;

  loader.show();

  // 🚫 Do NOT attach token to login or refresh calls
  const isAuthApi =
    req.url.includes('Login/LoginUser') ||
    req.url.includes('Login/GenerateAccessTokenFromRefreshToken');

  const authReq = (!isAuthApi && accessToken)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 && refreshToken && !isAuthApi) {

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);
           const refreshTokenObject ={
              refreshToken: refreshToken
            }
          return http.post<any>(`${apiUrl}Login/GenerateAccessTokenFromRefreshToken`,  refreshTokenObject ).pipe(
            switchMap(res => {
              if (res.statusCode === 200) {
                const newAccessToken = res.accessToken;

                sessionStorage.setItem('accessToken', newAccessToken);
                refreshTokenSubject.next(newAccessToken);
                isRefreshing = false;

                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newAccessToken}` }
                });

                return next(newReq);
              } else {
                throw new Error('Refresh token invalid');
              }
            }),
            catchError(err => {
              isRefreshing = false;
              sessionStorage.clear();
              toaster.error('Session expired. Please login again.');
              router.navigate(['/']);
              return throwError(() => err);
            })
          );
        }

        // ⏳ Wait for refresh to finish
        return refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token =>
            next(req.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
            }))
          )
        );
      }

      return throwError(() => error);
    }),
    finalize(() => loader.hide())
  );
};
