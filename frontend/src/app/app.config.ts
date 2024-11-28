import { ApplicationConfig, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { tokenInterceptor } from './core/token.interceptor';

export const API_URL = new InjectionToken<string>('apiUrl', {
  providedIn: 'root',
  factory: () => "http://localhost:8000/",
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: API_URL, useValue: "http://localhost:8000/" },
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
    )
  ]
};