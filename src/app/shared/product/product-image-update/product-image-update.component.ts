import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  AddImageResponse,
  DeleteImageResponse,
  GetImageByProductIdResponse,
  GetImageByProductIdResponseData,
} from './../../../product/image.interface';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ImageService } from './../../../product/image.service';
import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorComponent } from '../../dialog/error/error.component';
import { ResMesComponent } from '../../dialog/res-mes/res-mes.component';

@Component({
  selector: 'app-product-image-update',
  templateUrl: './product-image-update.component.html',
  styleUrls: ['./product-image-update.component.scss'],
})
export class ProductImageUpdateComponent implements OnInit {
  pageLoading = false;
  imagesChanges = false;

  imagesDetails: GetImageByProductIdResponseData;

  imageForm: FormGroup;

  constructor(
    private imageService: ImageService,
    public dialogRef: MatDialogRef<ProductImageUpdateComponent>,
    private formBuilder: FormBuilder,
    private dialogService: MatDialog,
    private router: Router,
    private snackbarService: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { productId: string; name: string },
  ) {
    this.imageForm = this.formBuilder.group({
      image: this.formBuilder.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.pageLoading = true;
    this.getImageByProductId();
  }

  async getImageByProductId(): Promise<void> {
    this.pageLoading = true;
    let getImageByProductIdResponse: GetImageByProductIdResponse;
    try {
      getImageByProductIdResponse = await this.imageService.getImageByProductId(
        this.dialogData.productId,
      );
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        getImageByProductIdResponse = { ...error.error };
      }
    }
    if (getImageByProductIdResponse.valid) {
      this.imagesDetails = getImageByProductIdResponse.data;
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in getImageByProductIdResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: getImageByProductIdResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in getImageByProductIdResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: getImageByProductIdResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/product/', this.dialogData.productId]);
    }
    this.pageLoading = false;
  }

  get image(): FormArray {
    return this.imageForm.get('image') as FormArray;
  }

  detectFiles(event: any): void {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.image.push(
            this.createImage({
              file,
              url: e.target.result,
            }),
          );
        };
        reader.readAsDataURL(file);
      }
    }
  }

  createImage(data: any): FormGroup {
    return this.formBuilder.group(data);
  }

  removeImage(i: number): void {
    this.image.removeAt(i);
  }

  async deleteImage(imageId: string): Promise<void> {
    console.log(imageId);

    this.pageLoading = true;
    let deleteImageResponse: DeleteImageResponse;
    try {
      deleteImageResponse = await this.imageService.deleteImage(imageId);
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        deleteImageResponse = { ...error.error };
      }
    }
    if (deleteImageResponse.valid) {
      this.snackbarService.open('Image deleted succssfully', 'Ok', {
        duration: 2 * 1000,
      });
      this.imagesChanges = true;
      this.imagesDetails.rows = this.imagesDetails.rows.filter(
        (imageObj) => imageId !== imageObj.id,
      );
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in deleteImageResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: deleteImageResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in deleteImageResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: deleteImageResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/product/', this.dialogData.productId]);
    }
    this.pageLoading = false;
  }

  async onSubmit(): Promise<void> {
    if (this.imageForm.invalid) {
      return;
    }
    this.pageLoading = true;
    this.imagesChanges = true;
    const addImageData = new FormData();
    for (const file of this.imageForm.value.image) {
      const fileObj: File = file.file;
      addImageData.append('image', fileObj, this.dialogData.name);
    }
    addImageData.append('productId', this.dialogData.productId);

    let addImageResponse: AddImageResponse;
    try {
      addImageResponse = await this.imageService.addImage(addImageData);
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        addImageResponse = { ...error.error };
      }
    }
    if (addImageResponse.valid) {
      this.snackbarService.open(addImageResponse.message, 'Ok', {
        duration: 2 * 1000,
      });
      this.image.clear();
      this.getImageByProductId();
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in addImageResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: addImageResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in addImageResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: addImageResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/product/', this.dialogData.productId]);
    }

    this.pageLoading = false;
  }
}
