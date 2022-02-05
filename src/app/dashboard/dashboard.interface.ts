export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface GetAcceptedOrderOfMerchantByMonthResponseData {
  data: number[];
  label: string;
  barLabels: string[];
}

export interface GetAcceptedOrderOfMerchantByMonthResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: GetAcceptedOrderOfMerchantByMonthResponseData;
}
