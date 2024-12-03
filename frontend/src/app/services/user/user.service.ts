import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../../app.config';
import {
  IUser,
  IGetAllUsersResponse,
} from '../../shared/user/get-all-users.interface';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../shared/user/routes.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  getAllUsers(): Observable<IGetAllUsersResponse> {
    const loginUrl = `${this.apiUrl}${UserRoutes.GET_ALL_USERS}`;
    return this.http.get<IGetAllUsersResponse>(loginUrl);
  }

  createUser(user: IUser): Observable<IUser> {
    const url = `${this.apiUrl}${UserRoutes.CREATE_USER}`;
    return this.http.post<IUser>(url, user);
  }

  updateUser(userId: number, user: IUser): Observable<IUser> {
    const url = `${this.apiUrl}${UserRoutes.UPDATE_USER}/${userId}/`;
    return this.http.put<IUser>(url, user);
  }

  deleteUser(userId: number): Observable<void> {
    const url = `${this.apiUrl}${UserRoutes.DELETE_USER}/${userId}/`;
    return this.http.delete<void>(url);
  }
}
