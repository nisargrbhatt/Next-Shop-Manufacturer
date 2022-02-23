import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Service } from 'src/app/auth/auth0.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  sideNavShow = false;
  isAuthenticated = false;

  constructor(
    private authService: Auth0Service,
    public auth0Service: AuthService,
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.authService.AuthStatusListener.subscribe(
      (authStatus) => {
        this.isAuthenticated = authStatus;
      },
    );
  }

  changeSideNavState(state: boolean): void {
    this.sideNavShow = state;
  }

  auth0Login(): void {
    this.auth0Service.loginWithRedirect().subscribe(() => {});
  }

  auth0Logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
