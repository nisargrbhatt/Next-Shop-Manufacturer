import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { SubSink } from 'subsink';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
})
export class HomeBannerComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isAuthenticated = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/home']);
    }
    this.subs.sink = this.auth.isAuthenticated$.subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
      if (authStatus) {
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
