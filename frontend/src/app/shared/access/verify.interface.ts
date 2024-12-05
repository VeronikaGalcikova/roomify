export interface IVerifyDto {
    card: string;
    room_reader: string;
}

export interface IVerifyResponse {
    access: boolean;
    detail?: string;
}