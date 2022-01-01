import {
  FindAllKYCApprovalsResponse,
  FindAllKYCApprovalsResponseData,
} from './../kyc.interface';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Auth0Service } from 'src/app/auth/auth0.service';
import { KycService } from '../kyc.service';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';
import { Auth0ProfileData } from 'src/app/auth/auth.interface';

@Component({
  selector: 'app-kyc-approvals',
  templateUrl: './kyc-approvals.component.html',
  styleUrls: ['./kyc-approvals.component.scss'],
})
export class KycApprovalsComponent implements OnInit {
  pageLoading = false;

  kycApprovals: FindAllKYCApprovalsResponseData;
  profileClaims: Auth0ProfileData;
  merchantVerified: boolean;

  constructor(
    private kycService: KycService,
    private authService: Auth0Service,
    private snackBarService: MatSnackBar,
    private dialogService: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;
    this.profileClaims = this.authService.ProfileClaims;
    this.merchantVerified = this.profileClaims.merchantVerified;
    this.getKycApprovals();
  }

  async getKycApprovals(): Promise<void> {
    this.pageLoading = true;

    let findAllKYCApprovalsResponse: FindAllKYCApprovalsResponse;

    try {
      findAllKYCApprovalsResponse = await this.kycService.findAllKYCApprovals();
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        findAllKYCApprovalsResponse = { ...error.error };
      }
    }
    if (findAllKYCApprovalsResponse.valid) {
      this.kycApprovals = findAllKYCApprovalsResponse.data;
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in findAllKYCApprovalsResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: findAllKYCApprovalsResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in findAllKYCApprovalsResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: findAllKYCApprovalsResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/']);
    }
    this.pageLoading = false;
  }
}
