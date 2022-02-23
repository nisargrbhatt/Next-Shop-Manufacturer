import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Service } from 'src/app/auth/auth0.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
})
export class HomeBannerComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isAuthenticated = false;

  constructor(private authService: Auth0Service, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.IsAuth;
    if (this.isAuthenticated) {
      this.router.navigate(['/home']);
    }
    this.subs.sink = this.authService.AuthStatusListener.subscribe(
      (authStatus) => {
        this.isAuthenticated = authStatus;
        if (authStatus) {
          this.router.navigate(['/home']);
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
