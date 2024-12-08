import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../../shared/user/get-all-users.interface';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: IUser[] = [];
  selectedUser: IUser | null = null;
  errorMessage: string = '';
  isEditing: boolean = false;
  isModalVisible = false;

  filter: IFilter = {
    id: null,
    username: '',
    email: '',
  };
  currentPage: number = 1;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers(1, 25);
  }

  showModal() {
    this.isModalVisible = true;
  }

  onModalClose() {
    this.isModalVisible = false;
  }
  
  loadUsers(page: number, limit: number): void {
    const findUsersByFilterDto = {
      page,
      limit,
      id: this.filter.id ? parseInt(this.filter.id) : undefined,
      username: this.filter.username || undefined,
      email: this.filter.email || undefined,
    };
    console.log(findUsersByFilterDto);
    this.userService.findUsersByFilter(findUsersByFilterDto).subscribe({
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
        this.loadUsers(this.currentPage, 25);
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
            this.loadUsers(this.currentPage, 25);
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
        this.loadUsers(1, 25);
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


  // Function to change the page
  changePage(page: number) {
    this.currentPage = page;
    this.loadUsers(page, 25);
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadUsers(1, 25);
  }
}

export interface IFilter {
  id?: string | null;
  username?: string;
  email?: string;
}
