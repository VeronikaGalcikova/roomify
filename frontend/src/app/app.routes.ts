import { Routes } from '@angular/router';
import { RegistrationComponent } from './features/registration/registration.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AccessSimulationComponent } from './features/access-simulation/access-simulation.component';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
    { path: 'registration', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'access-simulation',
      component: AccessSimulationComponent,
      canActivate: [AuthGuard],
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  ];
