import { LoginData } from './login/login.interface';
import { SignupData } from './signup/signup.interface';
import {
  UserData,
  SignupResponse,
  AuthData,
  LoginResponse,
} from './auth.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private userData: UserData;

  private authStatusListener = new Subject<boolean>();

  constructor(private httpService: HttpClient, private router: Router) {}

  get Token(): string {
    return this.token;
  }
  get UserId(): string {
    return this.userId;
  }
  get UserData(): UserData {
    return this.userData;
  }
  get IsAuth(): boolean {
    return this.isAuthenticated;
  }
  get AuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  checkEmail(email: string): Observable<{ ok: boolean }> {
    email = email.replace(' ', '').replace('[$!%*?&/]', '');
    return this.httpService.get<{ ok: boolean }>(
      BACKEND_URL + '/user/emailCheck?email=' + email,
    );
  }

  async getNewUserData(): Promise<void> {
    this.userData = {
      ...this.userData,
      emailVerified: true,
    };
    const authData = {
      ...this.userData,
      userId: this.userId,
    };
    localStorage.removeItem('userData');
    localStorage.setItem('userData', JSON.stringify(authData));
  }

  async signup(signupData: SignupData): Promise<SignupResponse> {
    return await this.httpService
      .post<SignupResponse>(BACKEND_URL + '/user/createUser', signupData)
      .toPromise();
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    return await this.httpService
      .post<LoginResponse>(BACKEND_URL + '/user/login', loginData)
      .toPromise();
  }

  async authUser(authData: AuthData): Promise<boolean> {
    // return new Promise((resolve, reject) => {
    this.token = authData.token;
    this.userId = authData.userId;
    this.userData = authData;
    const expiresInDuration = authData.expiresIn;
    this.setAuthTimer(expiresInDuration);
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
    this.saveAuthData(
      expirationDate,
      authData.token,
      authData.userId,
      authData,
    );
    return true;
    //   resolve(true);
    // });
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    expirationDate: Date,
    token: string,
    userId: string,
    authData: AuthData,
  ): void {
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userData', JSON.stringify(authData));
  }

  private getAuthData(): {
    token: string;
    expirationDate: Date;
    userId: string;
    userData: AuthData;
  } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userData = localStorage.getItem('userData');
    if (!token || !expirationDate || !userId || !userData) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      userData: JSON.parse(userData),
    };
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userData = authInformation.userData;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    } else {
      this.logout();
    }
  }
  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.userData = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
  }
}
