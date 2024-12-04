import { Routes } from '@angular/router';
import { RegistrationComponent } from './features/registration/registration.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AccessSimulationComponent } from './features/access-simulation/access-simulation.component';
import { AuthGuard } from './core/auth.guard';
import { UserManagementComponent } from './features/dashboard/user-management/user-management.component';
import { CardManagementComponent } from './features/dashboard/card-management/card-management.component';

export const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'user-management', component: UserManagementComponent },
      { path: 'card-management', component: CardManagementComponent },
      // Add other child routes here
    ],
  },
  {
    path: 'access-simulation',
    component: AccessSimulationComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
