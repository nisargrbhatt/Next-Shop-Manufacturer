import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateKycApprovalResponse } from './../kyc.interface';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';

import { KycService } from './../kyc.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-kyc-approval',
  templateUrl: './create-kyc-approval.component.html',
  styleUrls: ['./create-kyc-approval.component.scss'],
})
export class CreateKycApprovalComponent implements OnInit {
  pageLoading = false;
  formLoading = false;
  disableControl = false;
  images: string[] = [];

  kycApprovalForm: FormGroup;
  public imageForm: FormGroup;

  constructor(
    private kycService: KycService,
    private formBuilder: FormBuilder,
    private snackBarService: MatSnackBar,
    private dialogService: MatDialog,
    private router: Router,
  ) {
    this.imageForm = this.formBuilder.group({
      photos: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.pageLoading = true;
    this.formLoading = true;

    this.kycApprovalForm = this.formBuilder.group({
      name: new FormControl(
        { value: '', disabled: this.disableControl },
        { validators: [Validators.required] },
      ),
      aadhaar_number: new FormControl(
        { value: '', disabled: this.disableControl },
        {
          validators: [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(12),
          ],
        },
      ),
      contact_no: new FormControl(
        { value: '', disabled: this.disableControl },
        {
          validators: [Validators.minLength(10), Validators.maxLength(10)],
        },
      ),
      email: new FormControl(
        { value: '', disabled: this.disableControl },
        {
          validators: [Validators.email, Validators.required],
        },
      ),
      photo: this.formBuilder.array([]),
    });

    this.formLoading = false;
    this.pageLoading = false;
  }

  createItem(data: any): FormGroup {
    return this.formBuilder.group(data);
  }

  get photos(): FormArray {
    return this.imageForm.get('photos') as FormArray;
  }

  detectFiles(event: any): void {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.photos.push(
            this.createItem({
              file,
              url: e.target.result,
            }),
          );
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(i: number): void {
    this.photos.removeAt(i);
  }

  async onCreate(): Promise<void> {
    if (this.kycApprovalForm.invalid && this.imageForm.value.photo.length > 0) {
      return;
    }

    this.formLoading = true;
    this.disableControl = true;

    const kycApprovalFormData = new FormData();
    kycApprovalFormData.append('name', this.kycApprovalForm.value.name);
    kycApprovalFormData.append(
      'aadhaar_number',
      this.kycApprovalForm.value.aadhaar_number,
    );
    kycApprovalFormData.append(
      'contact_no',
      this.kycApprovalForm.value.contact_no,
    );
    kycApprovalFormData.append('email', this.kycApprovalForm.value.email);
    for (const files of this.imageForm.value.photos) {
      const fileObj: File = files.file;
      kycApprovalFormData.append('image', fileObj);
    }

    let createKycApprovalResponse: CreateKycApprovalResponse;
    try {
      createKycApprovalResponse = await this.kycService.createKycApproval(
        kycApprovalFormData,
      );
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        createKycApprovalResponse = { ...error.error };
      }
    }
    if (createKycApprovalResponse.valid) {
      this.snackBarService.open(createKycApprovalResponse.message, 'Ok', {
        duration: 5 * 1000,
      });
      this.router.navigate(['/kyc']);
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in createKycApprovalResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: createKycApprovalResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in createKycApprovalResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: createKycApprovalResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/kyc']);
    }
    this.formLoading = false;
    this.disableControl = false;
  }
}
