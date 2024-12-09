import { Component } from '@angular/core';
import { RoomReaderService } from '../../../services/room-reader/room-reader.service';
import { IRoomReader } from '../../../shared/room-reader/get-all-room-readers.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rooms-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './rooms-management.component.html',
  styleUrl: './rooms-management.component.css',
})
export class RoomsManagementComponent {
  roomReaders: IRoomReader[] = [];
  selectedRoomReader: IRoomReader | null = null;
  isEditing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isModalVisible = false;
  
  filter: IFilter = {
    name: '',
    ip: '',
  };

  active: boolean = false;
  inactive: boolean = false;
  currentPage: number = 1;

  constructor(
    private roomReaderService: RoomReaderService,     
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoomReaders(1, 25);
  }
  
  showModal() {
    this.isModalVisible = true;
  }

  onModalClose() {
    this.isModalVisible = false;
  }

  loadRoomReaders(page: number, limit: number): void {
    this.roomReaderService.findRoomReadersByFilter({...this.filter, page, limit}).subscribe({
      next: (response) => {
        this.roomReaders = response;
      },
      error: (error: any) => {
        console.error('Error fetching room readers:', error);
        this.errorMessage = 'Failed to load room readers.';
      },
    });
  }

  createRoomReader(roomReader: Partial<IRoomReader>): void {
    this.roomReaderService.createRoomReader(roomReader).subscribe({
      next: (newReader: IRoomReader) => {
        this.loadRoomReaders(this.currentPage, 25);
        this.cancelEdit();
        this.showSuccessMessage('Room reader added successfully!');
      },
      error: (error: any) => {
        console.error('Error creating room reader:', error);
        this.showErrorMessage('Failed to add room reader.');
      },
    });
  }

  updateRoomReader(): void {
    if (this.selectedRoomReader) {
      this.roomReaderService
        .updateRoomReader(this.selectedRoomReader.uid, this.selectedRoomReader)
        .subscribe({
          next: (updatedReader: IRoomReader) => {
            this.isEditing = false;
            this.selectedRoomReader = null;
            this.loadRoomReaders(this.currentPage, 25);
            this.showSuccessMessage('Room reader updated successfully!');
          },
          error: (error: any) => {
            console.error('Error updating room reader:', error);
            this.showErrorMessage('Failed to update room reader.');
          },
        });
    }
  }

  deleteRoomReader(uid: string): void {
    this.roomReaderService.deleteRoomReader(uid).subscribe({
      next: () => {
        this.loadRoomReaders(this.currentPage, 25);
        this.successMessage = 'Room reader deleted successfully!';
      },
      error: (error: any) => {
        console.error('Error deleting room reader:', error);
        this.errorMessage = 'Failed to delete room reader.';
      },
    });
  }

  initiateAdd(): void {
    this.selectedRoomReader = {
      uid: '',
      name: '',
      ip: '',
      active: false,
    };
    this.isEditing = false;
  }

  initiateEdit(reader: IRoomReader): void {
    this.selectedRoomReader = { ...reader };
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.selectedRoomReader = null;
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
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
    this.loadRoomReaders(page, 25);
  }

  onFilterChange() {
    console.log('act:', this.active, this.inactive);
    this.currentPage = 1;

    if (this.active && this.inactive) {
      this.filter.active = undefined;
    }

    else if (this.active) {
      this.filter.active = true;
    }

    else if (this.inactive) {
      this.filter.active = false;
    }
  
    else {
      this.filter.active = undefined;
    }

    console.log('filter:', this.filter);

    this.loadRoomReaders(1, 25);
  }
}

export interface IFilter {
  name: string;
  ip: string;
  active?: boolean;
}