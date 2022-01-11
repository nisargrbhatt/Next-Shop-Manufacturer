import { ProductImageUpdateComponent } from './../../shared/product/product-image-update/product-image-update.component';
import { RenewTheApprovalForProductData } from './../product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductService } from '../product.service';
import { ProductData } from '../product.interface';

import { distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-open',
  templateUrl: './product-open.component.html',
  styleUrls: ['./product-open.component.scss'],
})
export class ProductOpenComponent implements OnInit {
  pageLoading = false;
  productDetails: ProductData;
  productId: string;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: MatSnackBar,
    private dialogService: MatDialog,
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;
    if (this.route.snapshot.params.id) {
      this.productId = this.route.snapshot.params.id;
    }

    this.productService.getProduct(this.productId).subscribe((data) => {
      this.productDetails = {
        ...data,
        specification: JSON.parse(data.specification),
      };
    });
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
        switchMap((changeDetected: boolean) => {
          if (changeDetected) {
            return this.productService.getProduct(this.productId);
          }
        }),
      )
      .subscribe((data) => {
        this.productDetails = {
          ...data,
          specification: JSON.parse(data.specification),
        };
      });
  }
}
