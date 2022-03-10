export interface IChat {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: any;
}

export class IGetRooms {
  rooms: any[];
}

export class IGetUserResponse {
  message: string;
  valid: boolean;
  data?: IUserData;
}

export class IUserData {
  email: string;
  id: string;
  name: string;
}
