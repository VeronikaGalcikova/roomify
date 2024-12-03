export interface IRegistrationDto {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IRegistrationResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
