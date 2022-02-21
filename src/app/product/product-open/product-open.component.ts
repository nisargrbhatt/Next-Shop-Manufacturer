import { ProductImageUpdateComponent } from './../../shared/product/product-image-update/product-image-update.component';
import { RenewTheApprovalForProductData } from './../product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductService } from '../product.service';
import { ProductData } from '../product.interface';

import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-product-open',
  templateUrl: './product-open.component.html',
  styleUrls: ['./product-open.component.scss'],
})
export class ProductOpenComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  pageLoading = false;
  productDetails: ProductData;
  productId: string;

  selectedImage = 0;

  reviewStar = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: MatSnackBar,
    private dialogService: MatDialog,
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;
    if (this.route.snapshot.params['id']) {
      this.productId = this.route.snapshot.params['id'];
    }

    this.subs.sink = this.productService
      .getProductWithCategoryPriceReviewManufacturer(this.productId)
      .subscribe((data) => {
        this.productDetails = {
          ...data,
          specification: JSON.parse(data.specification),
        };
        this.findReviewStar();
      });
  }

  findReviewStar(): void {
    const total = this.productDetails.reviewes.length;
    if (!total) {
      this.reviewStar = 0;
      return;
    }
    const sum = this.productDetails.reviewes.reduce(
      (previous: number, current: any) => {
        return previous + current.stars;
      },
      0,
    );
    this.reviewStar = Math.floor(sum / total);
  }

  async onApprovalRenew(): Promise<void> {
    const renewTheApprovalForProductData: RenewTheApprovalForProductData = {
      productId: this.productId,
    };

    this.productService
      .renewTheApprovalForProduct(renewTheApprovalForProductData)
      .subscribe((response) => {
        this.snackbarService.open('Product approval Renewed', 'Ok', {
          duration: 2 * 1000,
        });
        this.router.navigate(['/product']);
      });
  }

  onImageUpdate(): void {
    const imageDialogRef = this.dialogService.open(
      ProductImageUpdateComponent,
      {
        data: { productId: this.productId, name: this.productDetails.name },
        autoFocus: true,
        hasBackdrop: true,
      },
    );
    imageDialogRef
      .afterClosed()
      .pipe(
        distinctUntilChanged(),
        filter((changeDetected: boolean) => changeDetected === true),
        switchMap(() => this.productService.getProduct(this.productId)),
      )
      .subscribe((data) => {
        this.productDetails = {
          ...data,
          specification: JSON.parse(data.specification),
        };
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
