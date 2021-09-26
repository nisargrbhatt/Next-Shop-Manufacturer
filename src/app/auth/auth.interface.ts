export interface UserData {
  token: string;
  expiresIn: number;
  role: string;
  access: string;
  emailVerified: boolean;
}

export interface ErrorData {
  code: string;
  message: string;
}

export interface DialogData {
  header: string;
  message: string;
}

export interface SignupResponseData {
  token: string;
  expiresIn: number;
  role: string;
  access: string;
  emailVerified: boolean;
  userId: string;
}
export interface LoginResponseData {
  token: string;
  expiresIn: number;
  role: string;
  access: string;
  emailVerified: boolean;
  userId: string;
}
export interface SignupResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: SignupResponseData;
}

export interface LoginResponse {
  message: string;
  valid: boolean;
  error?: ErrorData;
  dialog?: DialogData;
  data?: LoginResponseData;
}

export interface AuthData {
  token: string;
  expiresIn: number;
  role: string;
  access: string;
  emailVerified: boolean;
  userId: string;
}
