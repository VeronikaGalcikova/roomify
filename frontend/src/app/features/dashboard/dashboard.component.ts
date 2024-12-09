import { LastAccessesComponent } from './last-accesses/last-accesses.component';
import { Component, OnInit } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementComponent } from './user-management/user-management.component';
import { CardManagementComponent } from './card-management/card-management.component';
import { RoomsManagementComponent } from './rooms-management/rooms-management.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AccessManagementComponent } from './access-management/access-management.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    UserManagementComponent,
    CardManagementComponent,
    RoomsManagementComponent,
    LastAccessesComponent,
    AccessManagementComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Property to track the selected view
  selectedView:
    | 'users-management'
    | 'cards-management'
    | 'rooms-management'
    | 'last-accesses'
    | 'access-management' = 'users-management';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin$) {
      this.router.navigate(['access-simulation']);
    }
  }

  // Method to change the selected view
  selectView(
    view:
      | 'users-management'
      | 'cards-management'
      | 'rooms-management'
      | 'last-accesses'
      | 'access-management'
  ): void {
    this.selectedView = view;
  }
}
