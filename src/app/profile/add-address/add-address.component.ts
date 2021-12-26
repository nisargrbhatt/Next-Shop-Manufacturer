import { AddAddressResponse } from './../profile.interface';
import { AddAddressData } from './add-address.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth0Service } from 'src/app/auth/auth0.service';
import { ProfileService } from '../profile.service';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit, OnDestroy {
  private isAuthenticate = false;
  pageLoding = false;
  formLoading = false;

  addressForm: FormGroup;
  addressFormDisabled = false;

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

    this.addressForm = new FormGroup({
      name: new FormControl(
        { value: '', disabled: this.addressFormDisabled },
        {
          validators: [Validators.required],
        },
      ),
      address_line1: new FormControl(
        { value: '', disabled: this.addressFormDisabled },
        {
          validators: [Validators.required],
        },
      ),
      address_line2: new FormControl({
        value: '',
        disabled: this.addressFormDisabled,
      }),
      city: new FormControl(
        { value: '', disabled: this.addressFormDisabled },
        {
          validators: [Validators.required],
        },
      ),
      state: new FormControl(
        { value: '', disabled: this.addressFormDisabled },
        {
          validators: [Validators.required],
        },
      ),
      zipcode: new FormControl(
        { value: '', disabled: this.addressFormDisabled },
        {
          validators: [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        },
      ),
      contact_no: new FormControl(
        { value: '', disabled: this.addressFormDisabled },
        {
          validators: [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        },
      ),
    });

    this.pageLoding = false;
  }

  disableAddressForm(): void {
    this.addressFormDisabled = true;
    this.addressForm.get('name').disable();
    this.addressForm.get('address_line1').disable();
    this.addressForm.get('address_line2').disable();
    this.addressForm.get('city').disable();
    this.addressForm.get('state').disable();
    this.addressForm.get('zipcode').disable();
    this.addressForm.get('contact_no').disable();
  }

  enableAddressForm(): void {
    this.addressFormDisabled = false;
    this.addressForm.get('name').enable();
    this.addressForm.get('address_line1').enable();
    this.addressForm.get('address_line2').enable();
    this.addressForm.get('city').enable();
    this.addressForm.get('state').enable();
    this.addressForm.get('zipcode').enable();
    this.addressForm.get('contact_no').enable();
  }

  async onAddressFormSubmit(): Promise<void> {
    if (this.addressForm.invalid) {
      return;
    }
    this.formLoading = true;
    this.disableAddressForm();

    const addAddressData: AddAddressData = {
      name: this.addressForm.value.name,
      address_line1: this.addressForm.value.address_line1,
      address_line2: this.addressForm.value.address_line2,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      zipcode: this.addressForm.value.zipcode,
      contact_no: this.addressForm.value.contact_no,
    };

    let addAddressResponse: AddAddressResponse;
    try {
      addAddressResponse = await this.profileService.addAddress(addAddressData);
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        addAddressResponse = { ...error.error };
      }
    }
    if (addAddressResponse.valid) {
      this.enableAddressForm();
      this.formLoading = false;
      this.snackbarService.open(addAddressResponse.message, 'Ok', {
        duration: 2 * 1000,
      });
      this.router.navigate(['/profile/profile-view']);
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in addAddressResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: addAddressResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in addAddressResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: addAddressResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.enableAddressForm();
      this.formLoading = false;
      this.snackbarService.open(addAddressResponse.message, 'Ok', {
        duration: 2 * 1000,
      });
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
