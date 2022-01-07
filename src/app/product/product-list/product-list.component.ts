import {
  GetProductWithCategoryByManufacturerIdResponseData,
  GetProductWithCategoryByManufacturerIdApprovalPendingResponseData,
  GetProductWithCategoryByManufacturerIdResponse,
  GetProductWithCategoryByManufacturerIdApprovalPendingResponse,
} from './../product.interface';
import { ProductService } from './../product.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorComponent } from 'src/app/shared/dialog/error/error.component';
import { ResMesComponent } from 'src/app/shared/dialog/res-mes/res-mes.component';
import { environment } from 'src/environments/environment';

import { MatSelectChange } from '@angular/material/select';
import { ProductCardSmallDetails } from 'src/app/shared/product/product.interface';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  pageLoading = false;
  dataLoading = false;

  filterValue: 'Pending' | 'Approved' = 'Pending';

  searchText = '';

  totalApprovals = 0;
  approvalsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [10, 20, 30, 40];

  approvedProducts: GetProductWithCategoryByManufacturerIdResponseData;
  pendingProducts: GetProductWithCategoryByManufacturerIdApprovalPendingResponseData;

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialogService: MatDialog,
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;
    this.getPendingProductApprovals();
    this.pageLoading = false;
  }

  onFilterChange(event: MatSelectChange): void {
    this.filterValue = event.source.value;
    if (this.filterValue === 'Pending') {
      this.getPendingProductApprovals();
    } else {
      this.getApprovedProducts();
    }
  }

  onProductClick(id: string): void {
    console.log(id);
  }

  getProductCardDetails(product: any): ProductCardSmallDetails {
    return {
      id: product.id,
      name: product.name,
      category: product.category.name,
      image: product.images[0].url,
    };
  }

  async getPendingProductApprovals(): Promise<void> {
    this.dataLoading = true;
    let getProductWithCategoryByManufacturerIdApprovalPendingResponse: GetProductWithCategoryByManufacturerIdApprovalPendingResponse;
    try {
      getProductWithCategoryByManufacturerIdApprovalPendingResponse =
        await this.productService.getProductWithCategoryByManufacturerIdApprovalPending(
          this.currentPage,
          this.approvalsPerPage,
          this.searchText,
        );
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        getProductWithCategoryByManufacturerIdApprovalPendingResponse = {
          ...error.error,
        };
      }
    }
    if (getProductWithCategoryByManufacturerIdApprovalPendingResponse.valid) {
      this.pendingProducts =
        getProductWithCategoryByManufacturerIdApprovalPendingResponse.data;
      this.totalApprovals = this.pendingProducts.count;
    } else {
      // Open Dialog to show dialog data
      if (
        'dialog' in
        getProductWithCategoryByManufacturerIdApprovalPendingResponse
      ) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: getProductWithCategoryByManufacturerIdApprovalPendingResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if (
        'error' in getProductWithCategoryByManufacturerIdApprovalPendingResponse
      ) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: getProductWithCategoryByManufacturerIdApprovalPendingResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/']);
    }

    this.dataLoading = false;
  }

  async getApprovedProducts(): Promise<void> {
    this.dataLoading = true;
    let getProductWithCategoryByManufacturerIdResponse: GetProductWithCategoryByManufacturerIdResponse;
    try {
      getProductWithCategoryByManufacturerIdResponse =
        await this.productService.getProductWithCategoryByManufacturerId(
          this.currentPage,
          this.approvalsPerPage,
          this.searchText,
        );
    } catch (error) {
      if (error.error instanceof ErrorEvent) {
        console.log(error);
      } else {
        getProductWithCategoryByManufacturerIdResponse = {
          ...error.error,
        };
      }
    }
    if (getProductWithCategoryByManufacturerIdResponse.valid) {
      this.approvedProducts =
        getProductWithCategoryByManufacturerIdResponse.data;
      this.totalApprovals = this.approvedProducts.count;
    } else {
      // Open Dialog to show dialog data
      if ('dialog' in getProductWithCategoryByManufacturerIdResponse) {
        const resMesDialogRef = this.dialogService.open(ResMesComponent, {
          data: getProductWithCategoryByManufacturerIdResponse.dialog,
          autoFocus: true,
          hasBackdrop: true,
        });
        await resMesDialogRef.afterClosed().toPromise();
      }

      // Open Dialog to show error data
      if ('error' in getProductWithCategoryByManufacturerIdResponse) {
        if (environment.debug) {
          const errorDialogRef = this.dialogService.open(ErrorComponent, {
            data: getProductWithCategoryByManufacturerIdResponse.error,
            autoFocus: true,
            hasBackdrop: true,
          });
          await errorDialogRef.afterClosed().toPromise();
        }
      }
      this.router.navigate(['/']);
    }

    this.dataLoading = false;
  }

  onPageChange(pageData: PageEvent): void {
    this.currentPage = pageData.pageIndex + 1;
    this.approvalsPerPage = pageData.pageSize;
    if (this.filterValue === 'Pending') {
      this.getPendingProductApprovals();
    } else {
      this.getApprovedProducts();
    }
  }
}
