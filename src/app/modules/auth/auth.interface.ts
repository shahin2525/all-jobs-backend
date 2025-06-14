import { TUserRole } from '../user/user.interface';

export type UserRole = 'admin' | 'employee' | 'recruiter';

export interface IUser {
  _id: string;
  email: string;
  role: UserRole;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ITokenPayload {
  id: string;
  role: UserRole;
}

export interface IAuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    role: UserRole;
  };
}

export interface IJwtPayload {
  userId: string;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;

  role: TUserRole;
  isActive: boolean;
}
