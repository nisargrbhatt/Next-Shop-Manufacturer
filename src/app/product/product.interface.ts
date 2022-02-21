import { Row } from './category.interface';

export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

// export interface GetProductResponseData {}

export interface GetProductWithCategoryByManufacturerIdResponseData {
  count: number;
  rows: ProductData[];
}
export interface GetProductWithCategoryByManufacturerIdApprovalPendingResponseData {
  count: number;
  rows: ProductData[];
}

export interface CreateProductResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface UpdateProductResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface GetProductResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: ProductData;
}

export interface GetProductWithCategoryByManufacturerIdResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: GetProductWithCategoryByManufacturerIdResponseData;
}

export interface GetProductWithCategoryByManufacturerIdApprovalPendingResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: GetProductWithCategoryByManufacturerIdApprovalPendingResponseData;
}

export interface RenewTheApprovalForProductResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface CreateProductData {
  name: string;
  image: unknown[];
  description: string;
  specification: string;
  categoryId: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  specification?: string;
  categoryId?: string;
  productId?: string;
  small_description?: string;
}

export interface RenewTheApprovalForProductData {
  productId: string;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  small_description: string;
  specification: string | any;
  slug: string;
  decline_count: number;
  decline_reason: string;
  approval_status: boolean;
  productApproved: boolean;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  images: Image[];
  category?: Row;
}

export interface Image {
  id: string;
  name: string;
  url: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  contact_no: string;
  role: string;
  email_verified: boolean;
  merchant_or_manufacturer_verified: boolean;
  createdAt: string;
  updatedAt: string;
}
