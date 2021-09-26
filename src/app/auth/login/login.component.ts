import { AuthData, LoginResponse } from './../auth.interface';
import { LoginData } from './login.interface';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmailVerificationComponent } from 'src/app/shared/dialog/email-verification/email-verification.component';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  pageLoading = false;
  loginLoading = false;
  disableControl = false;

  // Password Input Consts
  showPassword = false;
  passwordCapitalLetter = false;
  passwordSpecialLetter = false;
  passwordNumber = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBarService: MatSnackBar,
    private dialogService: MatDialog,
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;
    this.loginForm = new FormGroup({
      email: new FormControl(
        { value: '', disabled: this.disableControl },
        {
          validators: [Validators.email, Validators.required],
        },
      ),
      password: new FormControl(
        { value: '', disabled: this.disableControl },
        {
          validators: [Validators.required],
        },
      ),
    });

    this.pageLoading = false;
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginLoading = true;
    this.disableControl = true;
    const loginData: LoginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      role: 'Manufacturer',
    };

    let loginResponse: LoginResponse;
    try {
      loginResponse = await this.authService.login(loginData);
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        loginResponse = { ...error.error };
      }
    }

    if (loginResponse.valid) {
      const authData: AuthData = {
        ...loginResponse.data,
      };
      await this.authService.authUser(authData);
      if (!authData.emailVerified) {
        this.snackBarService.open(loginResponse.message, 'Ok', {
          duration: 5 * 1000,
        });

        // Open Dialog to ask for verification of email
        const emailVerficationDialogRef = this.dialogService.open(
          EmailVerificationComponent,
          {
            autoFocus: true,
            hasBackdrop: true,
            disableClose: true,
          },
        );
        const emailVerificationDecision: boolean =
          await emailVerficationDialogRef.afterClosed().toPromise();
        console.log(emailVerificationDecision);

        if (emailVerificationDecision) {
          // Profile Route

          this.router.navigate(['/profile/profile-view']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/']);
      }
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in loginResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: loginResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in loginResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: loginResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/']);
    }

    this.disableControl = false;
    this.loginLoading = false;
  }

  passwordErrorChecker(data: any): void {
    this.passwordCapitalLetter = this.passwordHasCapitalLetter(
      data.target.value,
    );
    this.passwordSpecialLetter = this.passwordHasSpecialLetter(
      data.target.value,
    );
    this.passwordNumber = this.passwordHasNumber(data.target.value);
  }
  passwordHasNumber(password: string): boolean {
    return !!password.match('(?=.*[0-9])');
  }
  passwordHasSpecialLetter(password: string): boolean {
    return !!password.match('(?=.*[@$!%*?&])');
  }
  passwordHasCapitalLetter(password: string): boolean {
    return !!password.match('(?=.*[A-Z])');
  }
}
