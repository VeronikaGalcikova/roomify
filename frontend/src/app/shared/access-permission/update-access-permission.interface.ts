import { IAccessPermission } from "./access-permission.interface";

export interface IUpdateAccessPermissionDto {
    card: string;
    room_reader: string;
    status: 'allowed' | 'not_allowed' | 'pending';
}

export interface IUpdateAccessPermissionResponse extends Array<IAccessPermission> {}