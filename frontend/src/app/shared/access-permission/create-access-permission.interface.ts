import { IAccessPermission } from "./access-permission.interface";

export interface ICreateAccessPermissionDto {
    card: string;
    room_reader: string;
    status: 'allowed' | 'not_allowed' | 'pending';
}

export interface ICreateAccessPermissionResponse extends Array<IAccessPermission> {}