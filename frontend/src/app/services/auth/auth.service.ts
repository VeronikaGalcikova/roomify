import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoginDto, ILoginResponse } from '../../shared/auth/login.interface';
import { AuthRoutes } from '../../shared/auth/routes.enum';
import { API_URL } from '../../app.config';
import { IRegistrationDto, IRegistrationResponse } from '../../shared/auth/registration.interface';
import { IJWTdata } from '../../shared/auth/jwt.interface';
import { IRefreshResponse } from '../../shared/auth/refresh.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  isAdminSubject$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject$.asObservable();

  userId$ = new BehaviorSubject<number | null>(null);
  userIdSubject$ = this.userId$.asObservable();
  
  constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) {
    this.refreshAuthStatus();
  }

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
        const tokenData = this.decodeToken(response.access);
        if (tokenData) {
          this.userId$.next(tokenData.user_id);
          this.isAdminSubject$.next(tokenData.is_superuser);
        }
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
    this.isAdminSubject$.next(false);
  }

  refreshToken(): Observable<IRefreshResponse | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return new Observable((observer) => {
        observer.next(null);
        observer.complete();
      });
    }

    const refreshUrl = `${this.apiUrl}${AuthRoutes.REFRESH}/`;
    const response = this.http.post<IRefreshResponse>(refreshUrl, {
      refresh: refreshToken,
    });

    response.subscribe({
      next: (response: IRefreshResponse) => {
        console.log('Token refreshed successfully', this.decodeToken(response.access));
        localStorage.setItem('accessToken', response.access);
        this.isAuthenticatedSubject.next(true);
      },
    });

    return response;
  }

  decodeToken(token: string): IJWTdata | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload); // Decodes Base64 string
      const tokenData = JSON.parse(decodedPayload);
      console.log('Decoded token data:', tokenData);
      return tokenData;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  refreshAdminStatus(data: IJWTdata) {
      this.isAdminSubject$.next(data.is_superuser);
    }

  refreshAuthStatus() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const tokenData = this.decodeToken(token);
      this.isAuthenticatedSubject.next(this.hasToken());
      if (tokenData) {
        this.refreshAdminStatus(tokenData);
        this.userId$.next(tokenData.user_id);
      }
    }
  }
}
