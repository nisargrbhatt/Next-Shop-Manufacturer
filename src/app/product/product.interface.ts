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
  rows: any[];
}
export interface GetProductWithCategoryByManufacturerIdApprovalPendingResponseData {
  count: number;
  rows: any[];
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
  data?: any;
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
}

export interface RenewTheApprovalForProductData {
  productId: string;
}
