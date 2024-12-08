import { Component } from '@angular/core';
import { RoomReaderService } from '../../../services/room-reader/room-reader.service';
import { IRoomReader } from '../../../shared/room-reader/get-all-users.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

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

  constructor(private roomReaderService: RoomReaderService) {}

  ngOnInit(): void {
    this.getRoomReaders();
  }

  
  showModal() {
    this.isModalVisible = true;
  }

  onModalClose() {
    this.isModalVisible = false;
  }

  getRoomReaders(): void {
    this.roomReaderService.getAllRoomReaders().subscribe({
      next: (readers: IRoomReader[]) => {
        this.roomReaders = readers;
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
        this.roomReaders.push(newReader);
        this.successMessage = 'Room reader created successfully!';
      },
      error: (error: any) => {
        console.error('Error creating room reader:', error);
        this.errorMessage = 'Failed to create room reader.';
      },
    });
  }

  updateRoomReader(): void {
    if (this.selectedRoomReader) {
      this.roomReaderService
        .updateRoomReader(this.selectedRoomReader.uid, this.selectedRoomReader)
        .subscribe({
          next: (updatedReader: IRoomReader) => {
            const index = this.roomReaders.findIndex(
              (r) => r.uid === updatedReader.uid
            );
            if (index !== -1) {
              this.roomReaders[index] = updatedReader;
            }
            this.isEditing = false;
            this.selectedRoomReader = null;
            this.successMessage = 'Room reader updated successfully!';
          },
          error: (error: any) => {
            console.error('Error updating room reader:', error);
            this.errorMessage = 'Failed to update room reader.';
          },
        });
    }
  }

  deleteRoomReader(uid: string): void {
    this.roomReaderService.deleteRoomReader(uid).subscribe({
      next: () => {
        this.roomReaders = this.roomReaders.filter((r) => r.uid !== uid);
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
      reader_state: false,
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
}
