export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface OAuthCallBody {
  email: string;
  name: string;
  sub: string;

  email_verified: boolean;
  role: string;
}

export interface OAuthCallResponseData {
  role: string;
  access: string;
  emailVerified: string;
  userId: string;
}

export interface OAuthCallResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: OAuthCallResponseData;
}

export interface Auth0ProfileData {
  role: string;
  access: string;
  emailVerified: string;
  userId: string;
}
