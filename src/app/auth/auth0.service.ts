import {
  OAuthCallBody,
  OAuthCallResponse,
  Auth0ProfileData,
} from './auth.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService, User } from '@auth0/auth0-angular';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../shared/dialog/error/error.component';
import { ResMesComponent } from '../shared/dialog/res-mes/res-mes.component';

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  private isAuthenticated = false;
  private profileClaims: Auth0ProfileData;
  private auth0ProfileClaims: User;

  private counter = 0;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private httpService: HttpClient,
    private authService: AuthService,
    private dialogService: MatDialog,
  ) {
    this.authService.error$.subscribe((error) => {
      console.log(error);
      this.authService.loginWithRedirect().subscribe(() => {});
    });

    this.authService.isAuthenticated$.subscribe((authStatus) => {
      this.authStatusListener.next(authStatus);

      if (authStatus) {
        this.authService.user$.subscribe((profileClaims) => {
          this.counter++;

          this.auth0ProfileClaims = profileClaims;
          if (authStatus && !this.isAuthenticated && this.counter < 2) {
            const oAuthCallBody: OAuthCallBody = {
              email: profileClaims.email,
              name: profileClaims.name,
              sub: profileClaims.sub,
              email_verified: profileClaims.email_verified,
              role: environment.role,
            };
            let oAuthCallResponse: OAuthCallResponse;
            this.httpService
              .post(BACKEND_URL + '/user/oAuthCall', oAuthCallBody)
              .toPromise()
              .then((oAuthCallResponse1: OAuthCallResponse) => {
                oAuthCallResponse = oAuthCallResponse1;
                // Save the state
                this.profileClaims = oAuthCallResponse.data;
                this.saveTheAuth0Data(this.profileClaims);
              })
              .catch((error) => {
                if (error.error instanceof ErrorEvent) {
                  console.log(error);
                } else {
                  oAuthCallResponse = { ...error.error };
                }
                // Open Dialog to show dialog data
                if ('dialog' in oAuthCallResponse) {
                  const resMesDialogRef = this.dialogService.open(
                    ResMesComponent,
                    {
                      data: oAuthCallResponse.dialog,
                      autoFocus: true,
                      hasBackdrop: true,
                    },
                  );
                  resMesDialogRef
                    .afterClosed()
                    .toPromise()
                    .then(() => {});
                }
                // Open Dialog to show error data
                if ('error' in oAuthCallResponse) {
                  if (environment.debug) {
                    const errorDialogRef = this.dialogService.open(
                      ErrorComponent,
                      {
                        data: oAuthCallResponse.error,
                        autoFocus: true,
                        hasBackdrop: true,
                      },
                    );
                    errorDialogRef
                      .afterClosed()
                      .toPromise()
                      .then(() => {});
                  }
                }
              });
          }
        });
      }
    });
  }

  saveTheAuth0Data(profileClaims: Auth0ProfileData): void {
    localStorage.setItem('profileClaims', JSON.stringify(profileClaims));
  }

  getTheAuth0Data(): Auth0ProfileData {
    return JSON.parse(localStorage.getItem('profileClaims'));
  }

  clearTheAuth0Data(): void {
    localStorage.removeItem('profileClaims');
  }

  autoAuth0(): void {
    const profileClaims = this.getTheAuth0Data();

    if (!profileClaims) {
      this.authStatusListener.next(false);
      this.isAuthenticated = false;
      return;
    }

    this.profileClaims = profileClaims;
    this.saveTheAuth0Data(this.profileClaims);
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  logout(): void {
    this.profileClaims = null;
    this.clearTheAuth0Data();
    this.authService.logout();
    this.authStatusListener.next(false);
  }

  get ProfileClaims(): Auth0ProfileData {
    return this.profileClaims;
  }

  get IsAuth(): boolean {
    return this.isAuthenticated;
  }

  get AuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  get Auth0ProfileClaims(): User {
    return this.auth0ProfileClaims;
  }
}
