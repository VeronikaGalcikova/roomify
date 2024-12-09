import { IAccessPermission } from "./access-permission.interface";

export interface IFindAccessPermissionsByFilterDto {
    page: number;
    limit: number;
    status?: string;
    card?: string;
    card_id?: string;
    room_reader?: string;
    room_reader_name?: string;
    user_id?: string;
}

export interface IFindAccessPermissionsByFilterResponse extends Array<IAccessPermission> {}