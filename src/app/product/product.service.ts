import {
  CreateProductData,
  CreateProductResponse,
  GetProductResponse,
  GetProductWithCategoryByManufacturerIdApprovalPendingResponse,
  GetProductWithCategoryByManufacturerIdResponse,
  RenewTheApprovalForProductData,
  RenewTheApprovalForProductResponse,
  UpdateProductData,
  UpdateProductResponse,
} from './product.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  environment,
  secureAPIURIs,
  basicAPIURIs,
} from 'src/environments/environment';
import { Auth0Service } from '../auth/auth0.service';

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
  ) {}

  async createProduct(
    createProductData: CreateProductData | any,
  ): Promise<CreateProductResponse> {
    return this.httpService
      .post<CreateProductResponse>(
        BACKEND_URL + secureAPIURIs.createProduct.url,
        createProductData,
      )
      .toPromise();
  }

  async updateProduct(
    updateProductData: UpdateProductData,
  ): Promise<UpdateProductResponse> {
    return await this.httpService
      .put<UpdateProductResponse>(
        BACKEND_URL + secureAPIURIs.updateProduct.url,
        updateProductData,
      )
      .toPromise();
  }

  async getProduct(productId: string): Promise<GetProductResponse> {
    return await this.httpService
      .get<GetProductResponse>(
        BACKEND_URL + basicAPIURIs.getProduct + `/?productId=${productId}`,
      )
      .toPromise();
  }

  async getProductWithCategoryByManufacturerId(): Promise<GetProductWithCategoryByManufacturerIdResponse> {
    return await this.httpService
      .get<GetProductWithCategoryByManufacturerIdResponse>(
        BACKEND_URL +
          basicAPIURIs.getProductWithCategoryByManufacturerId +
          `/?manufacturerId=${this.authService.ProfileClaims.userId}`,
      )
      .toPromise();
  }

  async getProductWithCategoryByManufacturerIdApprovalPending(): Promise<GetProductWithCategoryByManufacturerIdApprovalPendingResponse> {
    return await this.httpService
      .get<GetProductWithCategoryByManufacturerIdApprovalPendingResponse>(
        BACKEND_URL +
          basicAPIURIs.getProductWithCategoryByManufacturerIdApprovalPending +
          `/?manufacturerId=${this.authService.ProfileClaims.userId}`,
      )
      .toPromise();
  }

  async renewTheApprovalForProduct(
    renewTheApprovalForProductData: RenewTheApprovalForProductData,
  ): Promise<RenewTheApprovalForProductResponse> {
    return await this.httpService
      .patch<RenewTheApprovalForProductResponse>(
        BACKEND_URL + secureAPIURIs.renewTheApprovalForProduct.url,
        renewTheApprovalForProductData,
      )
      .toPromise();
  }
}
