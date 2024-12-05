import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICard } from '../../../shared/card/find-cards-by-user.interface';
import { CardService } from '../../../services/card/card.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { IUser } from '../../../shared/user/get-all-users.interface';

@Component({
  selector: 'app-card-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-management.component.html',
  styleUrls: ['./card-management.component.css'],
})
export class CardManagementComponent implements OnInit {
  cards: ICard[] = [];
  selectedCard: ICard | null = null;
  users: IUser[] = [];
  errorMessage: string = '';
  isEditing: boolean = false;

  constructor(
    private cardService: CardService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCards();
    this.loadUsers();
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

  //load users to select from when creating new card
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Loaded Users:', this.users); // Add this line
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showErrorMessage('Failed to load users.');
      },
    });
  }

  // Add a new card
  addCard(newCard: ICard): void {
    const cardData = {
      card_id: newCard.card_id,
      allowed: newCard.expiration_date,
      user: newCard.user, // Ensure 'user' is selected from existing users
    };
    this.cardService.createCard(newCard).subscribe({
      next: () => {
        this.loadCards();
        this.cancelEdit();
        this.showSuccessMessage('Card added successfully!');
      },
      error: (error) => {
        console.error('Error adding card:', error);
        this.showErrorMessage('Failed to add card.');
      },
    });
  }

  // Edit an existing card
  editCard(card: ICard): void {
    this.isEditing = true;
    this.selectedCard = { ...card };
  }

  // Update card details
  updateCard(): void {
    if (this.selectedCard) {
      this.cardService
        .updateCard(this.selectedCard.uid, this.selectedCard)
        .subscribe({
          next: () => {
            this.isEditing = false;
            this.selectedCard = null;
            this.loadCards();
            this.showSuccessMessage('Card updated successfully!');
          },
          error: (error) => {
            console.error('Error updating card:', error);
            this.showErrorMessage('Failed to update card.');
          },
        });
    }
  }

  // Delete a card
  deleteCard(uid: string): void {
    this.cardService.deleteCard(uid).subscribe({
      next: () => {
        this.loadCards();
        this.showSuccessMessage('Card deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting card:', error);
        this.showErrorMessage('Failed to delete card.');
      },
    });
  }

  // Initialize for adding a new card
  initiateAddCard(): void {
    this.isEditing = false;
    this.selectedCard = { card_id: '', expiration_date: '', user: 0 } as ICard;
  }

  // Cancel add/edit operation
  cancelEdit(): void {
    this.isEditing = false;
    this.selectedCard = null;
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
