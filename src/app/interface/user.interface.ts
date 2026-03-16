export interface UserPayload {
  name: string;
  email: string;
  password: string;
}

export interface IJwtPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
}
export enum Role {
  ADMIN='ADMIN',
  USER='USER',
}

export enum UserStatus {
  ACTIVE='ACTIVE',
  INACTIVE='INACTIVE',
  BLOCKED='BLOCKED',
}


export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string | null;

  role: Role;
  status: UserStatus;

  image?: string | null;
  otp?: string | null;
  otpExpiry?: Date | null;

  notification: boolean;
  fcmToken?: string | null;

  birthday?: string | null;
  age?: number | null;
  number?: string | null;

  address?: any; // because Json
  skill?: string | null;

  forgetPasswordToken?: string | null;
  forgetPasswordTokenExpires?: Date | null;

  goal?: string | null;
  focus?: string | null;

  isEmailVerified: boolean;
  language?: string | null;

  gender: "MALE" | "FEMALE" | "OTHERS";

  createdAt: Date;
  updatedAt: Date;
}