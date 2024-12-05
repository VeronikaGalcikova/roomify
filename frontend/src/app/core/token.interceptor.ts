import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('accessToken');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Handle 401 errors
      if (error.status === 401) {
        console.error('Token expired, refreshing token...');
        return authService.refreshToken().pipe(
          switchMap((response) => {
            if (response) {
              console.log('Token refreshed successfully');
              localStorage.setItem('accessToken', response.access);
              return next(
                req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${response.access}`),
                })
              );
            }
            return throwError(() => new Error('Token refresh failed'));
          }),
          catchError((refreshError) => {
            // If refresh also fails, handle accordingly (e.g., logout user)
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
