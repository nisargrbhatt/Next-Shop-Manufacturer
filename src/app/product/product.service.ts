import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from './../shared/shared.service';
import {
  CreateProductData,
  CreateProductResponse,
  GetProductResponse,
  GetProductWithCategoryByManufacturerIdApprovalPendingResponse,
  GetProductWithCategoryByManufacturerIdResponse,
  ProductData,
  RenewTheApprovalForProductData,
  RenewTheApprovalForProductResponse,
  UpdateProductData,
  UpdateProductResponse,
} from './product.interface';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import {
  environment,
  secureAPIURIs,
  basicAPIURIs,
} from 'src/environments/environment';
import { Auth0Service } from '../auth/auth0.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private httpService: HttpClient,
    private authService: Auth0Service,
    private snackbarService: MatSnackBar,
    private router: Router,
  ) {}

  createProduct(createProductData: CreateProductData | any): void {
    this.httpService
      .post<CreateProductResponse>(
        BACKEND_URL + secureAPIURIs.createProduct.url,
        createProductData,
      )
      .subscribe((response) => {
        this.snackbarService.open(response.message, 'Ok', {
          duration: 2 * 1000,
        });
        this.router.navigate(['/product']);
      });
  }

  updateProduct(updateProductData: UpdateProductData): void {
    this.httpService
      .put<UpdateProductResponse>(
        BACKEND_URL + secureAPIURIs.updateProduct.url,
        updateProductData,
      )
      .subscribe((response) => {
        this.snackbarService.open(response.message, 'Ok', {
          duration: 2 * 1000,
        });
        this.router.navigate(['/product/', updateProductData.productId]);
      });
  }

  getProduct(productId: string): Observable<any> {
    return this.httpService
      .get<GetProductResponse>(
        BACKEND_URL + basicAPIURIs.getProduct + `/?productId=${productId}`,
      )
      .pipe(map((response) => response.data));
  }

  getProductWithCategoryPriceReviewManufacturer(
    productId: string,
  ): Observable<any> {
    return this.httpService
      .get<GetProductResponse>(
        BACKEND_URL +
          basicAPIURIs.getProductWithCategoryPriceReviewManufacturer +
          `/?productId=${productId}`,
      )
      .pipe(map((response) => response.data));
  }

  getProductWithCategoryByManufacturerId(
    currentPage: number,
    pageSize: number,
    search?: string,
  ): Observable<any> {
    const searchFilter = search?.replace(new RegExp('[.?/=#]'), '');
    return this.httpService
      .get<GetProductWithCategoryByManufacturerIdResponse>(
        BACKEND_URL +
          basicAPIURIs.getProductWithCategoryByManufacturerId +
          `/?manufacturerId=${
            this.authService?.ProfileClaims?.userId
          }&currentPage=${currentPage}&pageSize=${pageSize}&search=${encodeURI(
            searchFilter,
          )}`,
      )
      .pipe(map((response) => response.data));
  }

  getProductWithCategoryByManufacturerIdApprovalPending(
    currentPage: number,
    pageSize: number,
    search?: string,
  ): Observable<any> {
    const searchFilter = search?.replace(new RegExp('[.?/=#]'), '');
    return this.httpService
      .get<GetProductWithCategoryByManufacturerIdApprovalPendingResponse>(
        BACKEND_URL +
          basicAPIURIs.getProductWithCategoryByManufacturerIdApprovalPending +
          `/?manufacturerId=${
            this.authService?.ProfileClaims?.userId
          }&currentPage=${currentPage}&pageSize=${pageSize}&search=${encodeURI(
            searchFilter,
          )}`,
      )
      .pipe(map((response) => response.data));
  }

  renewTheApprovalForProduct(
    renewTheApprovalForProductData: RenewTheApprovalForProductData,
  ): Observable<any> {
    return this.httpService.patch<RenewTheApprovalForProductResponse>(
      BACKEND_URL + secureAPIURIs.renewTheApprovalForProduct.url,
      renewTheApprovalForProductData,
    );
  }

  getAllProductsWithSearch(
    currentPage: number,
    pageSize: number,
    search?: string,
  ): Observable<any> {
    return this.httpService
      .get<GetProductWithCategoryByManufacturerIdApprovalPendingResponse>(
        BACKEND_URL +
          basicAPIURIs.getAllProductWithSearchByManufacturerId +
          `/?manufacturerId=${
            this.authService?.ProfileClaims?.userId
          }&currentPage=${currentPage}&pageSize=${pageSize}&search=${encodeURI(
            search,
          )}`,
      )
      .pipe(map((response) => response.data));
  }

  getAllProducts(currentPage: number, pageSize: number): Observable<any> {
    return this.httpService
      .get<GetProductWithCategoryByManufacturerIdApprovalPendingResponse>(
        BACKEND_URL +
          basicAPIURIs.getAllProductsByManufacturerId +
          `/?manufacturerId=${this.authService?.ProfileClaims?.userId}&currentPage=${currentPage}&pageSize=${pageSize}`,
      )
      .pipe(map((response) => response.data));
  }
}
