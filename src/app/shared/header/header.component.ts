import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

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

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.subs.sink = this.auth.isAuthenticated$.subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
    });
  }

  changeSideNavState(state: boolean): void {
    this.sideNavShow = state;
  }

  auth0Login(): void {
    this.auth.loginWithRedirect().subscribe(() => {});
  }

  auth0Logout(): void {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
