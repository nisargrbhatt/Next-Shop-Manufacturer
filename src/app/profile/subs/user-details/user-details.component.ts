import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth0Service } from 'src/app/auth/auth0.service';
import { ProfileService } from '../../profile.service';
import { User } from '@auth0/auth0-angular';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private isAuthenticate = false;
  pageLoding = false;

  public auth0ProfileClaims: User;

  private authStatusSub: Subscription;

  constructor(private authService: Auth0Service) {}

  ngOnInit(): void {
    this.pageLoding = true;

    this.isAuthenticate = this.authService.IsAuth;

    this.authStatusSub = this.authService.AuthStatusListener.subscribe(
      (authStatus) => {
        this.isAuthenticate = authStatus;
      },
    );

    this.auth0ProfileClaims = this.authService.Auth0ProfileClaims;
    this.pageLoding = false;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
