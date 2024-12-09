import { IAccessPermission } from "./access-permission.interface";

export interface ICreateAccessPermissionDto extends IAccessPermission {}

export interface ICreateAccessPermissionResponse extends Array<IAccessPermission> {}