import { Component, OnInit } from '@angular/core';

import { Auth0Service } from 'src/app/auth/auth0.service';

import { User } from '@auth0/auth0-angular';
import { Auth0ProfileData } from 'src/app/auth/auth.interface';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  pageLoding = false;

  public auth0ProfileClaims: User | undefined | null;
  public profileClaims: Auth0ProfileData | undefined;

  constructor(private authService: Auth0Service) {}

  ngOnInit(): void {
    this.pageLoding = true;

    this.auth0ProfileClaims = this.authService.Auth0ProfileClaims;
    this.profileClaims = this.authService.ProfileClaims;
    this.pageLoding = false;
  }
}
