import { IAccessPermission } from "./access-permission.interface";

export interface IUpdateAccessPermissionDto extends IAccessPermission {}

export interface IUpdateAccessPermissionResponse extends Array<IAccessPermission> {}