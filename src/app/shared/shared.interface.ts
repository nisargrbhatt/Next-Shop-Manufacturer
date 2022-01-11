export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}
