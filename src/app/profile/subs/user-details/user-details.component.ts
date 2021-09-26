import { VerifyEmailComponent } from '../../verify-email/verify-email.component';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  GetUserDetailsData,
  GetUserDetailsResponse,
} from './../../profile.interface';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from '../../profile.service';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private isAuthenticate = false;
  pageLoding = false;
  formLoading = false;
  showOtp = false;

  userDetailsForm: FormGroup;
  userDetailsFormDisabled = false;

  userDetails: GetUserDetailsData;

  private authStatusSub: Subscription;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
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
          this.router.navigate(['/auth/login']);
        }
      },
    );

    this.userDetailsForm = new FormGroup({
      email: new FormControl(
        { value: '', disabled: this.userDetailsFormDisabled },
        { validators: [Validators.required, Validators.email] },
      ),
      name: new FormControl(
        { value: '', disabled: this.userDetailsFormDisabled },
        { validators: [Validators.required] },
      ),
      contact_no: new FormControl(
        { value: '', disabled: this.userDetailsFormDisabled },
        { validators: [Validators.required] },
      ),
    });

    this.disableUserDetailsForm();

    this.getUserDetails();
  }

  disableUserDetailsForm(): void {
    this.userDetailsFormDisabled = true;
    this.userDetailsForm.get('name').disable();
    this.userDetailsForm.get('email').disable();
    this.userDetailsForm.get('contact_no').disable();
  }
  enableUserDetailsForm(): void {
    this.userDetailsFormDisabled = false;
    this.userDetailsForm.get('name').enable();
    this.userDetailsForm.get('email').enable();
    this.userDetailsForm.get('contact_no').enable();
  }

  get userDetailsFormEmail(): AbstractControl {
    return this.userDetailsForm.get('email');
  }
  get userDetailsFormName(): AbstractControl {
    return this.userDetailsForm.get('name');
  }
  get userDetailsFormContactNo(): AbstractControl {
    return this.userDetailsForm.get('contact_no');
  }

  async getUserDetails(): Promise<void> {
    this.pageLoding = true;

    let getUserDetailsReponse: GetUserDetailsResponse;
    try {
      getUserDetailsReponse = await this.profileService.getUserDetails();
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        getUserDetailsReponse = { ...error.error };
      }
    }

    if (getUserDetailsReponse.valid) {
      this.userDetails = getUserDetailsReponse.data;

      this.userDetailsForm.setValue({
        email: this.userDetails.email,
        name: this.userDetails.name,
        contact_no: this.userDetails.contact_no,
      });
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

    this.pageLoding = false;
  }

  async onUserDetailsFormSubmit(): Promise<void> {
    if (this.userDetailsForm.invalid) {
      return;
    }
    this.formLoading = true;
    this.disableUserDetailsForm();

    this.formLoading = false;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
