import { IUser } from './user.interface';

export type UserUpdate = Omit<IUser, 'password' | 'code' | 'email'>;
