export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface GetImageByProductIdResponseData {
  count: number;
  rows: any[];
}

export interface AddImageResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface DeleteImageResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface GetImageByProductIdResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: GetImageByProductIdResponseData;
}

export interface AddImageData {
  image: unknown[];
  productId: string;
}
