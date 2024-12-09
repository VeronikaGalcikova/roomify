import { Component } from '@angular/core';
import { IJWTdata } from '../../shared/auth/jwt.interface';
import { CardService } from '../../services/card/card.service';
import { ICard, IFindCardsByUserResponse } from '../../shared/card/find-cards-by-user.interface';
import { CommonModule } from '@angular/common';
import { RoomReaderService } from '../../services/room-reader/room-reader.service';
import { IRoomReader } from '../../shared/room-reader/get-all-room-readers.interface';
import { AccessService } from '../../services/access/access.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  roomReaders: IRoomReaderWithAccess[] = [];
  errorMessages: string[] = [];
  draggedCardId: string | null = null;

  today = new Date();

  constructor(
    private cardService: CardService,
    private roomReaderService: RoomReaderService,
    private accessService: AccessService,
    private snackBar: MatSnackBar
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
        this.roomReaders = roomReaders.map(reader => ({ ...reader, accessGranted: null }));
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
      const tokenData = JSON.parse(decodedPayload);
      console.log('Decoded token data:', tokenData);
      return tokenData;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  onDragStart(event: DragEvent, card: ICard): void {
    this.draggedCardId = card.uid;
    event.dataTransfer?.setData('text', card.card_id);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, reader: IRoomReaderWithAccess): void {
    event.preventDefault();
    if (this.draggedCardId) {
      console.log(`Card with ID "${this.draggedCardId}" dropped on Reader "${reader.name}"`);
      this.accessService
        .verify({
          card: this.draggedCardId,
          room_reader: reader.uid,
        })
        .subscribe({
          next: (response) => {
            console.log('Access verified successfully!', response);
            if (response.access) {
              this.showSuccessMessage('Access Granted!');
              reader.accessGranted = true;

              // Reset accessGranted after a timeout
              setTimeout(() => {
                reader.accessGranted = null; // Reset after display
              }, 2000);
            } else {
                this.showSuccessMessage(`Access Denied! ${response?.detail ?? ''}`);
              reader.accessGranted = false;

              // Reset accessGranted after a timeout
              setTimeout(() => {
                reader.accessGranted = null; // Reset after display
              }, 2000);
            }
          },
          error: (error) => {
            console.error('Access verification failed!', error);
            alert('Access Denied!');
            reader.accessGranted = false;

            // Reset accessGranted after a timeout
            setTimeout(() => {
              reader.accessGranted = null; // Reset after display
            }, 2000);
            this.errorMessages.push('Access verification failed!');
          },
        });
    }
  }
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }
}

export interface IRoomReaderWithAccess extends IRoomReader {
  accessGranted: boolean | null;
}
