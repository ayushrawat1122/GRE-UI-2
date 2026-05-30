import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { IdleService } from './idle.service';

export interface JwtPayload {
  sub: string;
  exp: number;
  email?: string;
  UserId?: string;
  StoreId: string;
  StoreName?: string;
  FirstName?: string;
  LastName?: string;
  UserName?: string;
  UserClassification?: string;
  UserType?: string;
  Type?: string;
  role?: string[];
  [key: string]: any;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private idleService = inject(IdleService);

  private apiUrl: string = environment.baseUrl;
  private loginUrl: string = 'Login/LoginUser';
  private verifyOtpUrl: string = 'Login/ValidateOtp';
  private forgotPasswordUrl: string = 'User/ForgotPassword';

  private userSubject = new BehaviorSubject<JwtPayload | null>(null);
  user$ = this.userSubject.asObservable();

constructor() {
  const token = this.getToken();
  const refreshToken = sessionStorage.getItem('refreshToken');

  if (token && !this.isTokenExpired(token)) {
    this.userSubject.next(this.decodeToken(token));
    this.idleService.startWatching();
    return;
  }

  // 🔥 If access token expired but refresh token exists → try refresh
  if (token && this.isTokenExpired(token) && refreshToken) {
    this.generateAccessTokenFromRefreshToken(refreshToken).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.setToken(res.accessToken, res.refreshToken);
          this.idleService.startWatching();
        } else {
          this.logout();
        }
      },
      error: () => this.logout()
    });
    return;
  }

  // ❌ Only logout when BOTH tokens are missing
  this.userSubject.next(null);
}


  // API: login
  loginUser(loginObject: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.loginUrl}`, loginObject);
  }

  // API: verify OTP
  verifyOtp(otpObject: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${this.verifyOtpUrl}`, otpObject);
  }

  // Token operations
  setToken(token: string, refreshToken: any): void {
    
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('refreshToken', refreshToken);
    const user = this.decodeToken(token);
    this.userSubject.next(user);
    this.idleService.startWatching();
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    return decoded.exp * 1000 < Date.now();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    this.idleService.stopWatching();

    this.userSubject.next(null);
    this.router.navigate(['']);
  }

  // getUser(): JwtPayload | null {
  //   return this.userSubject.value;
  // }
getUser(): JwtPayload | null {
  const token = this.getToken();

  if (!token) return null;

  // ⏳ Don't force logout here — interceptor will refresh
  // if (this.isTokenExpired(token)) {
  //   return null;
  // }

  const user = this.decodeToken(token);
  this.userSubject.next(user);
  return user;
}

  setUser(user: JwtPayload): void {
    this.userSubject.next(user);
  }
  // Auto-logout when token expires
  // private scheduleAutoLogout(token: string): void {
  //   const decoded = this.decodeToken(token);
  //   const expiresIn = decoded.exp * 1000 - Date.now();

  //   setTimeout(() => {
  //     this.logout();
  //   }, expiresIn);
  // }

generateAccessTokenFromRefreshToken(refreshToken: string) {
  const refreshTokenObject ={
  refreshToken: refreshToken
  }
  return this.http.post<any>(
    `${this.apiUrl}Login/GenerateAccessTokenFromRefreshToken`,
    refreshTokenObject,  
  );
}
  forgotPassword(forgotPasswordObject: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.forgotPasswordUrl}`, forgotPasswordObject);
  }
}
