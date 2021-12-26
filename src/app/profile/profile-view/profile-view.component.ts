import { GetAddressesData, GetAddressesResponse } from './../profile.interface';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Auth0Service } from '../../auth/auth0.service';
import { ProfileService } from './../profile.service';
import {
  Component,
  OnDestroy,
  OnInit,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  private isAuthenticate = false;
  pageLoding = false;
  formLoading = false;

  private authStatusSub: Subscription;

  constructor(
    private profileService: ProfileService,
    private authService: Auth0Service,
    private router: Router,
    private snackbarService: MatSnackBar,
    private dialogService: MatDialog,
  ) {}

  ngOnInit(): void {
    this.pageLoding = true;

    this.isAuthenticate = this.authService.IsAuth;
    this.authStatusSub = this.authService.AuthStatusListener.subscribe(
      (authStatus) => {
        this.isAuthenticate = authStatus;
        if (!this.isAuthenticate) {
          this.router.navigate(['/login']);
        }
      },
    );
    this.pageLoding = false;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
