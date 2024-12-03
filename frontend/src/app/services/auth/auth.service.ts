import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoginDto, ILoginResponse } from '../../shared/auth/login.interface';
import { AuthRoutes } from '../../shared/auth/routes.enum';
import { API_URL } from '../../app.config';
import { IRegistrationDto, IRegistrationResponse } from '../../shared/auth/registration.interface';

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  login(loginDto: ILoginDto): Observable<ILoginResponse> {
    const loginUrl = `${this.apiUrl}${AuthRoutes.LOGIN}/`;
    const response = this.http.post<ILoginResponse>(loginUrl, loginDto);

    response.subscribe({
      next: (response: ILoginResponse) => {
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        this.isAuthenticatedSubject.next(true);
      },
    });

    return response;
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

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isAuthenticatedSubject.next(false);
  }
}
