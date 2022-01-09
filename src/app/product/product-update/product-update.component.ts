import {
  GetProductResponse,
  ProductData,
  UpdateProductData,
  UpdateProductResponse,
} from './../product.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CategoryService } from './../category.service';
import { ProductService } from './../product.service';
import { Component, OnInit } from '@angular/core';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';
import {
  GetAllCategoryResponse,
  GetAllCategoryResponseData,
} from '../category.interface';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ProductCardSmallDetails,
  ProductCardLongDetails,
} from 'src/app/shared/product/product.interface';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss'],
})
export class ProductUpdateComponent implements OnInit {
  pageLoading = false;
  productId: string;
  productForm: FormGroup;
  productDetails: ProductData;
  categories: GetAllCategoryResponseData;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: MatSnackBar,
    private dialogService: MatDialog,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;

    this.productForm = this.formBuilder.group({
      name: this.formBuilder.control('', { validators: [Validators.required] }),
      categoryId: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
      specification: this.formBuilder.array([], {
        validators: [Validators.required],
      }),
      small_description: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
      description: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.productId = paramMap.get('id');
        this.getProductData();
      } else {
        this.snackbarService.open('Bad Route', 'Ok', {
          duration: 2 * 1000,
        });
      }
    });
  }

  get specification(): FormArray {
    return this.productForm.get('specification') as FormArray;
  }

  createSpecification(label?: string, value?: string): void {
    this.specification.push(
      this.formBuilder.group({
        label: this.formBuilder.control(label, {
          validators: [Validators.required],
        }),
        value: this.formBuilder.control(value, {
          validators: [Validators.required],
        }),
      }),
    );
  }

  removeSpecification(index: number): void {
    this.specification.removeAt(index);
  }

  async getProductData(): Promise<void> {
    this.pageLoading = true;

    let getProductResponse: GetProductResponse;
    try {
      getProductResponse = await this.productService.getProduct(this.productId);
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        getProductResponse = {
          ...error.error,
        };
      }
    }
    if (getProductResponse.valid) {
      this.productDetails = getProductResponse.data;
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in getProductResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: getProductResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in getProductResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: getProductResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/product']);
    }
    this.getCategoryData();
  }

  async getCategoryData(): Promise<void> {
    this.pageLoading = true;
    let getCategoryDataResponse: GetAllCategoryResponse;
    try {
      getCategoryDataResponse = await this.categoryService.getAllCategories();
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        getCategoryDataResponse = { ...error.error };
      }
    }
    if (getCategoryDataResponse.valid) {
      this.categories = getCategoryDataResponse.data;
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in getCategoryDataResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: getCategoryDataResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in getCategoryDataResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: getCategoryDataResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/product']);
    }

    this.formDataBind();
  }

  async formDataBind(): Promise<void> {
    this.pageLoading = true;
    this.productForm.get('name').setValue(this.productDetails.name);
    this.productForm.get('categoryId').setValue(this.productDetails.categoryId);
    this.productForm
      .get('small_description')
      .setValue(this.productDetails.small_description);
    this.productForm
      .get('description')
      .setValue(this.productDetails.description);
    for (let specificationItem of JSON.parse(
      this.productDetails.specification,
    )) {
      this.createSpecification(
        specificationItem.label,
        specificationItem.value,
      );
    }
    this.pageLoading = false;
  }

  get productCardSmallDetails(): ProductCardSmallDetails {
    const name = this.productForm.value.name
      ? this.productForm.value.name.length < 33
        ? this.productForm.value.name
        : this.productForm.value.name.slice(0, 30) + '...'
      : 'Product Name';
    const productCardSmallDetails: ProductCardSmallDetails = {
      name: name,
      category:
        this.categories.rows.find((category) => {
          return category.id === this.productForm.value.categoryId;
        })?.name || 'Category',
      image: this.productDetails.images[0].url,
    };
    return productCardSmallDetails;
  }

  get productCardLongDetails(): ProductCardLongDetails {
    const name = this.productForm.value.name
      ? this.productForm.value.name.length < 33
        ? this.productForm.value.name
        : this.productForm.value.name.slice(0, 30) + '...'
      : 'Product Name';
    const small_description = this.productForm.value.small_description
      ? this.productForm.value.small_description.length < 103
        ? this.productForm.value.small_description
        : this.productForm.value.small_description.slice(0, 100) + '...'
      : 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur voluptates maxime facilis a laboriosam atque reiciendis impedit saepe vero recusandae assumenda illum esse delectus aliquam corrupti ipsam, eos autem aspernatur.'.slice(
          0,
          100,
        ) + '...';
    const productCardLongDetails: ProductCardLongDetails = {
      name: name,
      category:
        this.categories.rows.find((category) => {
          return category.id === this.productForm.value.categoryId;
        })?.name || 'Category',
      image: this.productDetails.images[0].url,
      small_description: small_description,
    };
    return productCardLongDetails;
  }

  async onSubmit(): Promise<void> {
    this.pageLoading = true;
    if (this.productForm.invalid) {
      return;
    }

    if (!this.productForm.dirty) {
      this.router.navigate(['/product/' + this.productId]);
      return;
    }

    const updateProductData: UpdateProductData = {
      name: this.productForm.value.name,
      categoryId: this.productForm.value.categoryId,
      description: this.productForm.value.description,
      productId: this.productId,
      small_description: this.productForm.value.small_description,
      specification: JSON.stringify(this.productForm.value.specification),
    };

    let updateProductResponse: UpdateProductResponse;
    try {
      updateProductResponse = await this.productService.updateProduct(
        updateProductData,
      );
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        updateProductResponse = { ...error.error };
      }
    }
    if (updateProductResponse.valid) {
      this.snackbarService.open(updateProductResponse.message, 'Ok', {
        duration: 2 * 1000,
      });
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in updateProductResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: updateProductResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in updateProductResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: updateProductResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
    }
    this.router.navigate(['/product/' + this.productId]);
  }
}
