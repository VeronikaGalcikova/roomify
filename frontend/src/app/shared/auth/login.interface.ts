export interface ILoginDto {
    username: string;
    password: string;
}

export interface ILoginResponse {
    refresh: string;
    access: string;
}