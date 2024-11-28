import { Component } from '@angular/core';
import { IJWTdata } from '../../shared/auth/jwt.interface';
import { CardService } from '../../services/card/card.service';
import { ICard, IFindCardsByUserResponse } from '../../shared/card/find-cards-by-user.interface';
import { CommonModule } from '@angular/common';
import { RoomReaderService } from '../../services/room-reader/room-reader.service';
import { IRoomReader } from '../../shared/room-reader/get-all-users.interface';

@Component({
  selector: 'app-access-simulation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './access-simulation.component.html',
  styleUrl: './access-simulation.component.css',
})
export class AccessSimulationComponent {
  decodedToken: IJWTdata | null = null;
  cards: ICard[] = [];
  roomReaders: IRoomReader[] = [];
  errorMessages: string[] = [];
  draggedCardId: string | null = null;

  constructor(
    private cardService: CardService,
    private roomReaderService: RoomReaderService
  ) {}

  ngOnInit(): void {
    const token = this.getAccessToken();
    if (token) {
      this.decodedToken = this.decodeToken(token);
    }
    this.cardService
      .findCardsByUser({ user_id: this.decodedToken?.user_id.toString() ?? '' })
      .subscribe({
        next: (response: IFindCardsByUserResponse) => {
          this.cards = response;
          console.log('User cards fetched successfully!', this.cards);
        },
        error: (error) => {
          console.error('Fetch user cards failed!', error);
          this.errorMessages.push('Fetch user cards failed!');
        },
      });

    this.roomReaderService.getAllRoomReaders().subscribe({
      next: (roomReaders) => {
        this.roomReaders = roomReaders;
        console.log('Room Readers fetched successfully!', this.roomReaders);
      },
      error: (error) => {
        console.error('Fetch Room Readers failed!', error);
        this.errorMessages.push('Fetch Room Readers failed!');
      },
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  decodeToken(token: string): IJWTdata | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload); // Decodes Base64 string
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  // Event handler for drag start
  onDragStart(event: DragEvent, card: ICard): void {
    this.draggedCardId = card.card_id;  // Save the card id for later reference
    event.dataTransfer?.setData('text', card.card_id); // Set the dragged card's ID in dataTransfer
  }

  // Allow the drop action on room readers
  onDragOver(event: DragEvent): void {
    event.preventDefault();  // Necessary to allow a drop
  }

  // Handle the drop event on a room reader
  onDrop(event: DragEvent, reader: IRoomReader): void {
    event.preventDefault();
    if (this.draggedCardId) {
      console.log(`Card with ID "${this.draggedCardId}" dropped on Reader "${reader.name}"`);
      // You can add further logic here, such as updating the state of the reader or the card
    }
  }
}
