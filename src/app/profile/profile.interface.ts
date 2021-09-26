export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface AddressData {
  id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zipcode?: string;
  contact_no?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserDetailsData {
  id: string;
  email: string;
  name: string;
  contact_no: string;
  role: string;
  email_otp_sent_time: string;
  email_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAddressesData {
  count: number;
  rows: AddressData[];
}

export interface GetAddressesResponse {
  message: string;
  valid: boolean;
  data?: GetAddressesData;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface GetAddressResonse {
  message: string;
  valid: boolean;
  data?: AddressData;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface GetUserDetailsResponse {
  message: string;
  valid: boolean;
  data?: GetUserDetailsData;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface AddAddressResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface GetEmailOtpResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface EmailOtpCheckResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}
