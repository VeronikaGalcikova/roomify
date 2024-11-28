export interface IGetAllRoomReadersResponse extends Array<IRoomReader> {}


export interface IRoomReader {
    uid: string;
    name: string;
    ip: string;
    reader_state: boolean;
}