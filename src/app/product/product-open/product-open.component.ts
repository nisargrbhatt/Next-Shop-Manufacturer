import { ProductImageUpdateComponent } from './../../shared/product/product-image-update/product-image-update.component';
import {
  GetProductResponse,
  RenewTheApprovalForProductData,
  RenewTheApprovalForProductResponse,
} from './../product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../category.service';
import { ProductService } from '../product.service';
import { ProductData } from '../product.interface';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';

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
    } else {
      this.router.navigate(['/product']);
    }
    this.getProductData();
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
      this.productDetails = {
        ...getProductResponse.data,
        specification: JSON.parse(getProductResponse.data.specification),
      };
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

    this.pageLoading = false;
  }

  async onApprovalRenew(): Promise<void> {
    const renewTheApprovalForProductData: RenewTheApprovalForProductData = {
      productId: this.productId,
    };

    let renewTheApprovalForProductResponse: RenewTheApprovalForProductResponse;
    try {
      renewTheApprovalForProductResponse =
        await this.productService.renewTheApprovalForProduct(
          renewTheApprovalForProductData,
        );
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        renewTheApprovalForProductResponse = {
          ...error.error,
        };
      }
    }
    if (renewTheApprovalForProductResponse.valid) {
      this.snackbarService.open('Product approval Renewed', 'Ok', {
        duration: 2 * 1000,
      });
      this.getProductData();
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in renewTheApprovalForProductResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: renewTheApprovalForProductResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in renewTheApprovalForProductResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: renewTheApprovalForProductResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/product']);
    }
  }

  async onImageUpdate(): Promise<void> {
    const imageDialogRef = this.dialogService.open(
      ProductImageUpdateComponent,
      {
        data: { productId: this.productId, name: this.productDetails.name },
        autoFocus: true,
        hasBackdrop: true,
      },
    );
    const changeDetected: boolean = await imageDialogRef
      .afterClosed()
      .toPromise();
    if (changeDetected) {
      this.getProductData();
    }
  }
}
