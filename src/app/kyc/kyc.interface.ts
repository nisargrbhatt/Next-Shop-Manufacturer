export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface FindAllKYCApprovalsResponseData {
  count: number;
  rows: FindKYCApprovalResponseDataRows[];
}

export interface FindKYCApprovalResponseDataRows {
  id: string;
  name: string;
  aadhaar_number: string;
  contact_no: string;
  email: string;
  kyc_approval: boolean;
  admin_decision: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  images: Image[];
}

export interface Image {
  id: string;
  name: string;
  url: string;
  kycId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  contact_no: null;
  role: string;
  email_otp: null;
  email_otp_sent_time: null;
  email_verified: boolean;
  merchant_or_manufacturer_verified: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CreateKycApprovalData {
  name: string;
  aadhaar_number: string;
  contact_no?: string;
  email?: string;
  image?: any[];
}

export interface CreateKycApprovalResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
}

export interface FindAllKYCApprovalsResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: FindAllKYCApprovalsResponseData;
}

export interface FindKYCApprovalResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: FindKYCApprovalResponseDataRows;
}
