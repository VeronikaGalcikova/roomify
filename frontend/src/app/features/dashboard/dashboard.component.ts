import { LastAccessesComponent } from './last-accesses/last-accesses.component';
import { Component, OnInit } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../shared/user/get-all-users.interface';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementComponent } from './user-management/user-management.component';
import { CardManagementComponent } from './card-management/card-management.component';
import { RoomsManagementComponent } from './rooms-management/rooms-management.component';

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
    | 'admin-panel' = 'users-management';

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // Method to change the selected view
  selectView(
    view:
      | 'users-management'
      | 'cards-management'
      | 'rooms-management'
      | 'last-accesses'
      | 'admin-panel'
  ): void {
    this.selectedView = view;
  }
}
