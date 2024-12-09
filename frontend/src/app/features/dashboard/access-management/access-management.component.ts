import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { IAccessPermission } from '../../../shared/access-permission/access-permission.interface';
import { AccessPermissionService } from '../../../services/access-permission/access-permission.service';
import { ICard } from '../../../shared/card/find-cards-by-user.interface';
import { IRoomReader } from '../../../shared/room-reader/get-all-room-readers.interface';
import { CardService } from '../../../services/card/card.service';
import { RoomReaderService } from '../../../services/room-reader/room-reader.service';

@Component({
  selector: 'app-access-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.css'],
})
export class AccessManagementComponent implements OnInit {
  perms: IAccessPermission[] = [];
  cards: ICard[] = [];
  readers: IRoomReader[] = [];
  selectedPerm: IAccessPermission | null = null;
  errorMessage: string = '';
  isEditing: boolean = false;
  isModalVisible = false;

  filter: IFilter = {
    status: '',
    card: '',
    card_id: '',
    room_reader: '',
    room_reader_name: '',
    user_id: '',
    user_name: '',
  };
  currentPage: number = 1;

  constructor(
    private permService: AccessPermissionService,
    private cardService: CardService,
    private roomReaderService: RoomReaderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPerms(1, 25);
    this.loadCards();
    this.loadRoomReaders();
  }

  showModal() {
    this.isModalVisible = true;
  }

  onModalClose() {
    this.isModalVisible = false;
  }

  loadCards(): void {
    this.cardService.getAllCards().subscribe({
      next: (cards) => {
        this.cards = cards;
      },
      error: (error) => {
        console.error('Error fetching cards:', error);
        this.errorMessage = 'Failed to load cards.';
        this.showErrorMessage('Failed to load cards.');
      },
    });
  }

  loadRoomReaders(): void {
    this.roomReaderService.getAllRoomReaders().subscribe({
      next: (readers: IRoomReader[]) => {
        this.readers = readers;
      },
      error: (error: any) => {
        console.error('Error fetching room readers:', error);
        this.errorMessage = 'Failed to load room readers.';
      },
    });
  }

  loadPerms(page: number, limit: number): void {
    this.permService.findAccessPermissionsByFilter({ limit, page }).subscribe({
      next: (perms) => {
        this.perms = perms;
      },
      error: (error) => {
        console.error('Error fetching cards:', error);
        this.errorMessage = 'Failed to load access permissions.';
        this.showErrorMessage('Failed to load access permissions.');
      },
    });
  }

  // Add a new card
  addPerm(newPerm: IAccessPermission): void {
    this.permService
      .createAccessPermission({
        status: newPerm.status,
        card: newPerm.card,
        room_reader: newPerm.room_reader,
      })
      .subscribe({
        next: () => {
          this.loadPerms(this.currentPage, 25);
          this.cancelEdit();
          this.showSuccessMessage('Access permission added successfully!');
        },
        error: (error) => {
          console.error('Error adding access permission:', error);
          this.showErrorMessage('Failed to add access permission.');
        },
      });
  }

  // Edit an existing card
  editPerm(perm: IAccessPermission): void {
    this.isEditing = true;
    this.selectedPerm = { ...perm };
  }

  // Update card details
  updatePerm(): void {
    if (this.selectedPerm) {
      this.permService
        .updateAccessPermission({ ...this.selectedPerm })
        .subscribe({
          next: () => {
            this.isEditing = false;
            this.selectedPerm = null;
            this.loadPerms(1, 25);
            this.showSuccessMessage('Access permission updated successfully!');
          },
          error: (error) => {
            console.error('Error updating access permission:', error);
            this.showErrorMessage('Failed to update access permission.');
          },
        });
    }
  }

  // Delete a card
  deletePerm(id: number): void {
    this.permService.deleteAccessPermission({ id }).subscribe({
      next: () => {
        this.loadPerms(this.currentPage, 25);
        this.showSuccessMessage('Access permission deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting acess permission:', error);
        this.showErrorMessage('Failed to delete access permission.');
      },
    });
  }

  // Initialize for adding a new card
  initiateAddPerm(): void {
    this.isEditing = false;
    this.selectedPerm = {
      id: 0,
      status: 'pending',
      card: '',
      card_id: '',
      room_reader: '',
      room_reader_name: '',
      user_id: '',
      user_name: '',
    };
  }

  // Cancel add/edit operation
  cancelEdit(): void {
    this.isEditing = false;
    this.selectedPerm = null;
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
    this.loadPerms(page, 25);
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadPerms(1, 25);
  }
}

export interface IFilter {
  status: string;
  card: string;
  card_id: string;
  room_reader: string;
  room_reader_name: string;
  user_id: string;
  user_name: string;
}
