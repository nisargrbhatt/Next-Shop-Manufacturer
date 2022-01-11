import { switchMap } from 'rxjs/operators';
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
import { of, Observable } from 'rxjs';

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
    this.imageService
      .getImageByProductId(this.dialogData.productId)
      .subscribe((data) => {
        this.imagesDetails = data;
      });
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

  deleteImage(imageId: string): void {
    this.pageLoading = true;

    this.imageService.deleteImage(imageId).subscribe((response) => {
      this.snackbarService.open('Image deleted succssfully', 'Ok', {
        duration: 2 * 1000,
      });
      this.imagesChanges = true;
      this.imagesDetails.rows = this.imagesDetails.rows.filter(
        (imageObj) => imageId !== imageObj.id,
      );
    });
  }

  async onSubmit(): Promise<void> {
    if (this.imageForm.invalid) {
      return;
    }

    this.imagesChanges = true;
    const addImageData = new FormData();
    for (const file of this.imageForm.value.image) {
      const fileObj: File = file.file;
      addImageData.append('image', fileObj, this.dialogData.name);
    }
    addImageData.append('productId', this.dialogData.productId);

    this.imageService
      .addImage(addImageData)
      .pipe(
        switchMap((response) => {
          this.snackbarService.open(response.message, 'Ok', {
            duration: 2 * 1000,
          });
          this.image.clear();
          return this.imageService.getImageByProductId(
            this.dialogData.productId,
          );
        }),
      )
      .subscribe((data) => {
        this.imagesDetails = data;
      });
  }

  getCloseData(): Observable<any> {
    return of(this.imagesChanges);
  }
}
