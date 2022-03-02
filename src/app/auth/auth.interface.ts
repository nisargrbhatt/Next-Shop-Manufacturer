export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface OAuthCallBody {
  email: string | undefined;
  name: string | undefined;
  sub: string | undefined;
  email_verified: boolean | undefined;
  role: string;
}

export class OAuthCallResponseData {
  role: string;
  access: string;
  emailVerified: string;
  userId: string;
  merchantVerified: boolean;
}

export class OAuthCallResponse {
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
  merchantVerified: boolean;
}
