import { Auth0Service } from 'src/app/auth/auth0.service';
import { Router } from '@angular/router';
import {
  EmailOtpCheckResponse,
  GetEmailOtpResponse,
  GetUserDetailsData,
  GetUserDetailsResponse,
} from '../profile.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from 'src/app/profile/profile.service';
import { environment } from 'src/environments/environment';
import { ErrorComponent } from '../../shared/dialog/error/error.component';
import { ResMesComponent } from '../../shared/dialog/res-mes/res-mes.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  pageLoading = false;
  formLoading = false;
  private isAuthenticate = false;

  otpForm: FormGroup;
  otpFormDisabled = false;

  userDetails: GetUserDetailsData;

  private authStatusSub: Subscription;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private snackbarService: MatSnackBar,
    private dialogService: MatDialog,
    private authService: Auth0Service,
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;

    this.isAuthenticate = this.authService.IsAuth;

    this.authStatusSub = this.authService.AuthStatusListener.subscribe(
      (authStatus) => {
        this.isAuthenticate = authStatus;
        if (!this.isAuthenticate) {
          this.router.navigate(['/auth/login']);
        }
      },
    );

    this.otpForm = new FormGroup({
      otp: new FormControl(
        { value: '', disabled: this.otpFormDisabled },
        {
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(4),
          ],
        },
      ),
    });
    this.getUserDetails();
  }

  async getUserDetails(): Promise<void> {
    this.pageLoading = true;

    let getUserDetailsReponse: GetUserDetailsResponse;
    try {
      getUserDetailsReponse = await this.profileService.getUserDetails();
    } catch (error: any) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        getUserDetailsReponse = { ...error.error };
      }
    }

    if (getUserDetailsReponse.valid) {
      this.userDetails = getUserDetailsReponse.data;
      if (this.userDetails.email_verified) {
        this.router.navigate(['/profile/profile-view']);
      }
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in getUserDetailsReponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: getUserDetailsReponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in getUserDetailsReponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: getUserDetailsReponse.error,
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

  disableOtpForm(): void {
    this.otpFormDisabled = true;
    this.otpForm.get('otp').disable();
  }

  enableOtpForm(): void {
    this.otpFormDisabled = false;
    this.otpForm.get('otp').enable();
  }

  async onOtpFormSubmit(): Promise<void> {
    if (this.otpForm.invalid) {
      return;
    }
    this.formLoading = true;
    this.disableOtpForm();

    const otpBody = {
      otp: this.otpForm.value.otp,
    };

    let emailOtpCheckResponse: EmailOtpCheckResponse;
    try {
      emailOtpCheckResponse = await this.profileService.emailOtpCheck(otpBody);
    } catch (error: any) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        emailOtpCheckResponse = { ...error.error };
      }
    }
    if (emailOtpCheckResponse.valid) {
      this.enableOtpForm();
      this.formLoading = false;
      this.snackbarService.open(emailOtpCheckResponse.message, 'Ok', {
        duration: 2 * 1000,
      });
      this.router.navigate(['/profile/profile-view']);
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in emailOtpCheckResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: emailOtpCheckResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in emailOtpCheckResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: emailOtpCheckResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.enableOtpForm();
      this.formLoading = false;
      this.snackbarService.open(emailOtpCheckResponse.message, 'Ok', {
        duration: 2 * 1000,
      });
    }
  }

  async getEmailOtp(): Promise<void> {
    this.formLoading = true;
    this.disableOtpForm();

    let getEmailOtpResponse: GetEmailOtpResponse;

    try {
      getEmailOtpResponse = await this.profileService.getEmailOtp();
    } catch (error: any) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        getEmailOtpResponse = { ...error.error };
      }
    }
    if (getEmailOtpResponse.valid) {
      this.enableOtpForm();
      this.formLoading = false;
      this.snackbarService.open(getEmailOtpResponse.message, 'Ok', {
        duration: 2 * 1000,
      });
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in getEmailOtpResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: getEmailOtpResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in getEmailOtpResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: getEmailOtpResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.enableOtpForm();
      this.formLoading = false;
      this.snackbarService.open(getEmailOtpResponse.message, 'Ok', {
        duration: 2 * 1000,
      });
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
