export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface GetAllCategoryResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: GetAllCategoryResponseData;
}

export interface GetAllCategoryResponseData {
  count: number;
  rows: Row[];
}

export interface Row {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
