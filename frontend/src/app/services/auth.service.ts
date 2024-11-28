import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginDto, ILoginResponse } from '../shared/auth/login.interface';
import {
  IRegistrationDto,
  IRegistrationResponse,
} from '../shared/auth/registration.interface';
import { AuthRoutes } from '../shared/auth/routes.enum';
import { API_URL } from '../app.config';

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  login(loginDto: ILoginDto): Observable<ILoginResponse> {
    const loginUrl = `${this.apiUrl}${AuthRoutes.LOGIN}/`;
    return this.http.post<ILoginResponse>(loginUrl, loginDto);
  }

  register(
    registrationDto: IRegistrationDto
  ): Observable<IRegistrationResponse> {
    const registrationUrl = `${this.apiUrl}${AuthRoutes.REGISTRATION}/`;
    return this.http.post<IRegistrationResponse>(
      registrationUrl,
      registrationDto
    );
  }
}
