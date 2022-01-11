import { SubSink } from 'subsink';
import { Auth0Service } from 'src/app/auth/auth0.service';
import { CreateProductResponse } from './../product.interface';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from './../category.service';
import {
  GetAllCategoryResponse,
  GetAllCategoryResponseData,
} from './../category.interface';
import {
  ProductCardSmallDetails,
  ProductCardLongDetails,
} from './../../shared/product/product.interface';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from './../product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  pageLoading = false;
  productForm: FormGroup;
  images: string[] = [];
  categories: GetAllCategoryResponseData;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBarService: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialogService: MatDialog,
    private authService: Auth0Service,
  ) {}
  ngOnInit(): void {
    if (!this.authService.ProfileClaims.merchantVerified) {
      this.snackBarService.open('KYC is not verified', 'Ok', {
        duration: 2 * 1000,
      });
      this.router.navigate(['/product']);
    }
    this.productForm = this.formBuilder.group({
      name: this.formBuilder.control('', { validators: [Validators.required] }),
      description: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
      small_description: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
      specification: this.formBuilder.array([], [Validators.required]),
      categoryId: this.formBuilder.control('', {
        validators: [Validators.required],
      }),
      image: this.formBuilder.array([], [Validators.required]),
    });

    this.subs.sink = this.categoryService
      .getAllCategories()
      .subscribe((data) => {
        this.categories = data;
      });
  }
  get specification(): FormArray {
    return this.productForm.get('specification') as FormArray;
  }
  createSpecification(): void {
    this.specification.push(
      this.formBuilder.group({
        label: this.formBuilder.control('', {
          validators: [Validators.required],
        }),
        value: this.formBuilder.control('', {
          validators: [Validators.required],
        }),
      }),
    );
  }
  removeSpecification(index: number): void {
    this.specification.removeAt(index);
  }
  get image(): FormArray {
    return this.productForm.get('image') as FormArray;
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
  get productCardSmallDetails(): ProductCardSmallDetails {
    const name = this.productForm.value.name
      ? this.productForm.value.name.length < 33
        ? this.productForm.value.name
        : this.productForm.value.name.slice(0, 30) + '...'
      : 'Product Name';
    const productCardSmallDetails: ProductCardSmallDetails = {
      name,
      category:
        this.categories.rows.find((category) => {
          return category.id === this.productForm.value.categoryId;
        })?.name || 'Category',
      image:
        this.productForm.value.image.length > 0
          ? this.productForm.value.image[0].url
          : '',
    };
    return productCardSmallDetails;
  }
  get productCardLongDetails(): ProductCardLongDetails {
    const name = this.productForm.value.name
      ? this.productForm.value.name.length < 33
        ? this.productForm.value.name
        : this.productForm.value.name.slice(0, 30) + '...'
      : 'Product Name';
    const smallDescription = this.productForm.value.small_description
      ? this.productForm.value.small_description.length < 103
        ? this.productForm.value.small_description
        : this.productForm.value.small_description.slice(0, 100) + '...'
      : 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur voluptates maxime facilis a labori...';
    const productCardLongDetails: ProductCardLongDetails = {
      name,
      category:
        this.categories.rows.find((category) => {
          return category.id === this.productForm.value.categoryId;
        })?.name || 'Category',
      image:
        this.productForm.value.image.length > 0
          ? this.productForm.value.image[0].url
          : '',
      small_description: smallDescription,
    };
    return productCardLongDetails;
  }

  async onCreateProduct(): Promise<void> {
    if (this.productForm.invalid) {
      return;
    }

    const createProductData = new FormData();
    createProductData.append('name', this.productForm.value.name);
    createProductData.append('description', this.productForm.value.description);
    createProductData.append('categoryId', this.productForm.value.categoryId);
    createProductData.append(
      'specification',
      JSON.stringify(this.productForm.value.specification),
    );
    createProductData.append(
      'small_description',
      this.productForm.value.small_description,
    );
    for (const files of this.productForm.value.image) {
      const fileObj: File = files.file;
      createProductData.append('image', fileObj, this.productForm.value.name);
    }
    this.productService.createProduct(createProductData);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
