import { forkJoin, Observable } from 'rxjs';
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
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss'],
})
export class ProductUpdateComponent implements OnInit {
  productId: string;
  productForm: FormGroup;
  productDetails: ProductData;
  categories: GetAllCategoryResponseData;
  product$: Observable<any>;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {}
  ngOnInit(): void {
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
    if (this.route.snapshot.params.id) {
      this.productId = this.route.snapshot.params.id;
    }
    forkJoin([
      this.categoryService.getAllCategories(),
      this.productService.getProduct(this.productId),
    ]).subscribe((results) => {
      this.categories = results[0];
      this.productDetails = results[1];
      this.formDataBind();
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

  formDataBind(): void {
    this.productForm.get('name').setValue(this.productDetails.name);
    this.productForm.get('categoryId').setValue(this.productDetails.categoryId);
    this.productForm
      .get('small_description')
      .setValue(this.productDetails.small_description);
    this.productForm
      .get('description')
      .setValue(this.productDetails.description);
    for (const specificationItem of JSON.parse(
      this.productDetails.specification,
    )) {
      this.createSpecification(
        specificationItem.label,
        specificationItem.value,
      );
    }
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
    const smallDescription = this.productForm.value.small_description
      ? this.productForm.value.small_description.length < 103
        ? this.productForm.value.small_description
        : this.productForm.value.small_description.slice(0, 100) + '...'
      : 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur voluptates maxime facilis a laboriosam atque reiciendis impedit saepe vero recusandae assumenda illum esse delectus aliquam corrupti ipsam, eos autem aspernatur.'.slice(
          0,
          100,
        ) + '...';
    const productCardLongDetails: ProductCardLongDetails = {
      name,
      category:
        this.categories.rows.find((category) => {
          return category.id === this.productForm.value.categoryId;
        })?.name || 'Category',
      image: this.productDetails.images[0].url,
      small_description: smallDescription,
    };
    return productCardLongDetails;
  }
  onSubmit(): void {
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

    this.productService.updateProduct(updateProductData);
  }
}
