import { IRoomReader } from "./get-all-room-readers.interface";

export interface IFindRoomReadersByFilterResponse extends Array<IRoomReader> {}

export interface IFindRoomReadersByFilterDto {
    page: number;
    limit: number;
    name?: string;
    ip?: string;
    active?: boolean;
}