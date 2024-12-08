export interface IGetAllUsersResponse extends Array<IUser> {}

export interface IUser {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  password: string;
  is_superuser: boolean;
}
