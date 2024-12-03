import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../../shared/user/get-all-users.interface';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: IUser[] = [];
  selectedUser: IUser | null = null;
  errorMessage: string = '';
  isEditing: boolean = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to load users.';
        this.showErrorMessage('Failed to load users.');
      },
    });
  }

  // Add a new user
  addUser(newUser: IUser): void {
    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.loadUsers();
        this.cancelEdit();
        this.showSuccessMessage('User added successfully!');
      },
      error: (error) => {
        console.error('Error adding user:', error);
        this.showErrorMessage('Failed to add user.');
      },
    });
  }

  // Edit an existing user
  editUser(user: IUser): void {
    this.isEditing = true;
    this.selectedUser = { ...user };
  }

  // Update user details
  updateUser(): void {
    if (this.selectedUser) {
      this.userService
        .updateUser(this.selectedUser.id, this.selectedUser)
        .subscribe({
          next: () => {
            this.isEditing = false;
            this.selectedUser = null;
            this.loadUsers();
            this.showSuccessMessage('User updated successfully!');
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.showErrorMessage('Failed to update user.');
          },
        });
    }
  }

  // Delete a user
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccessMessage('User deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.showErrorMessage('Failed to delete user.');
      },
    });
  }

  // Initialize for adding a new user
  initiateAddUser(): void {
    this.isEditing = false;
    this.selectedUser = {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
    } as IUser;
  }

  // Cancel add/edit operation
  cancelEdit(): void {
    this.isEditing = false;
    this.selectedUser = null;
  }

  // Display success message
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }

  // Display error message
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error'],
    });
  }
}
