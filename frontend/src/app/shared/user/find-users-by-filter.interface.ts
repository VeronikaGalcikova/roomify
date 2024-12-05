import { IUser } from "./get-all-users.interface";

export interface IFindUsersByFilterResponse extends Array<IUser> {}

export interface IFindUsersByFilterDto {
  page: number;
  limit: number;
  id?: number;
  username?: string;
  email?: string;
}