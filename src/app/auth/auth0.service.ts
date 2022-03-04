import {
  OAuthCallBody,
  OAuthCallResponse,
  Auth0ProfileData,
} from './auth.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, mergeMap, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService, User } from '@auth0/auth0-angular';

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  private profileClaims: Auth0ProfileData | undefined;
  private auth0ProfileClaims: User | undefined | null;

  constructor(
    private httpService: HttpClient,
    private authService: AuthService,
  ) {
    this.authService.error$
      .pipe(
        filter((e: any) => e.error === 'login_required'),
        mergeMap(() => this.authService.loginWithRedirect()),
      )
      .subscribe();

    this.authService.isAuthenticated$
      .pipe(
        filter((authStatus: boolean) => authStatus === true),
        switchMap(() => this.authService.user$),
        filter((user: any) => !!user),
        switchMap((profileClaims: User) => {
          this.auth0ProfileClaims = profileClaims;
          const oAuthCallBody: OAuthCallBody = {
            email: profileClaims.email,
            name: profileClaims.name,
            sub: profileClaims.sub,
            email_verified: profileClaims.email_verified,
            role: environment.role,
          };

          return this.httpService.post<OAuthCallResponse>(
            BACKEND_URL + '/user/oAuthCall',
            oAuthCallBody,
          );
        }),
        filter((response) => !!response && !!response.data),
      )
      .subscribe((response: OAuthCallResponse) => {
        this.profileClaims = response.data;
      });
  }

  logout(): void {
    this.authService.logout();
  }

  get ProfileClaims(): Auth0ProfileData | undefined {
    return this.profileClaims;
  }

  get Auth0ProfileClaims(): User | undefined | null {
    return this.auth0ProfileClaims;
  }

  init(): void {
    console.log('Auth init');
  }
}
