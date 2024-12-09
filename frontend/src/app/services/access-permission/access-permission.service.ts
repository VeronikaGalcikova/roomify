import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../../app.config';
import { AccessPermissionRoutes } from '../../shared/access-permission/routes.enum';
import {
  IFindAccessPermissionsByFilterDto,
  IFindAccessPermissionsByFilterResponse,
} from '../../shared/access-permission/find-access-permissions-by-filter.interface';
import { Observable } from 'rxjs';
import {
  IDeleteAccessPermissionDto,
  IDeleteAccessPermissionResponse,
} from '../../shared/access-permission/delete-access-permission.interface';
import {
  IUpdateAccessPermissionDto,
  IUpdateAccessPermissionResponse,
} from '../../shared/access-permission/update-access-permission.interface';
import {
  ICreateAccessPermissionDto,
  ICreateAccessPermissionResponse,
} from '../../shared/access-permission/create-access-permission.interface';

@Injectable({
  providedIn: 'root',
})
export class AccessPermissionService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  findAccessPermissionsByFilter(
    findAccessPermissionsByFilterDto: IFindAccessPermissionsByFilterDto
  ): Observable<IFindAccessPermissionsByFilterResponse> {
    const findAccessPermissionsByFilterUrl = `${this.apiUrl}${AccessPermissionRoutes.FIND_ACCESS_PERMISSIONS_BY_FILTER}`;
    return this.http.post<IFindAccessPermissionsByFilterResponse>(
      findAccessPermissionsByFilterUrl,
      findAccessPermissionsByFilterDto
    );
  }

  createAccessPermission(
    createAccessPermissionDto: ICreateAccessPermissionDto
  ): Observable<ICreateAccessPermissionResponse> {
    const createAccessPermissionUrl = `${this.apiUrl}${AccessPermissionRoutes.CREATE_ACCESS_PERMISSION}`;
    return this.http.post<ICreateAccessPermissionResponse>(
      createAccessPermissionUrl,
      createAccessPermissionDto
    );
  }

  updateAccessPermission(
    id: number,
    updateAccessPermissionDto: IUpdateAccessPermissionDto
  ): Observable<IUpdateAccessPermissionResponse> {
    const updateAccessPermissionUrl = `${this.apiUrl}${AccessPermissionRoutes.UPDATE_ACCESS_PERMISSION}${id}/`;
    return this.http.put<IUpdateAccessPermissionResponse>(
      updateAccessPermissionUrl,
      updateAccessPermissionDto
    );
  }

  deleteAccessPermission(
    deleteAccessPermissionDto: IDeleteAccessPermissionDto
  ): Observable<IDeleteAccessPermissionResponse> {
    const deleteAccessPermissionUrl = `${this.apiUrl}${AccessPermissionRoutes.DELETE_ACCESS_PERMISSION}${deleteAccessPermissionDto.id}/`;
    return this.http.delete<IDeleteAccessPermissionResponse>(
      deleteAccessPermissionUrl
    );
  }
}
