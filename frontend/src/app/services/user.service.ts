import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { IGetAllUsersResponse } from '../shared/user/get-all-users.interface';
import { Observable } from 'rxjs';
import { UserRoutes } from '../shared/user/routes.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  getAllUsers(): Observable<IGetAllUsersResponse> {
    const loginUrl = `${this.apiUrl}${UserRoutes.GET_ALL_USERS}`;
    return this.http.get<IGetAllUsersResponse>(loginUrl);
  }
}
