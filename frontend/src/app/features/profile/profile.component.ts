import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { IFindUsersByFilterResponse } from '../../shared/user/find-users-by-filter.interface';
import { IUser } from '../../shared/user/get-all-users.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomEntryLogService } from '../../services/room-entry-logs/room-entry-log.service';
import { CardService } from '../../services/card/card.service';
import { RoomReaderService } from '../../services/room-reader/room-reader.service';
import { IRoomReader } from '../../shared/room-reader/get-all-room-readers.interface';
import { ICard } from '../../shared/card/find-cards-by-user.interface';
import { IRoomEntryLog } from '../../shared/entry-log/entry-log.interface';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  isModalVisible = false;
  entryLogs: IRoomEntryLog[] = [];
  public user: IUser = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    id: 0,
    password: '',
    is_superuser: false,
  };

  filter: IFilter = {
    id: null,
    username: '',
    card_id: '',
    reader_id: '',
    reader_name: '',
    type: '',
  };
  currentPage: number = 1;
  cards: ICard[] = [];
  cardMap: { [key: string]: number } = {}; // card.uid to user.id
  roomReaders: IRoomReader[] = [];
  readerMap: { [key: string]: string } = {}; // reader.uid to reader.name
  selectedCard: ICard | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomEntryLogService: RoomEntryLogService,
    private cardService: CardService,
    private roomReaderService: RoomReaderService
  ) {}

  ngOnInit(): void {
    this.authService.userIdSubject$.subscribe((userId) => {
      this.userService
        .findUsersByFilter({ id: userId ?? -1, page: 1, limit: 1 })
        .subscribe({
          next: (response: IFindUsersByFilterResponse) => {
            this.user = response[0];
            console.log('User:', this.user);
            this.fetchCards()
              .then(() => this.fetchRoomReaders())
              .then(() => this.fetchEntryLogs(1, 25))
              .catch((error) => {
                console.error('Initialization error:', error);
              });
          },
          error: (error) => {
            console.error('Fetch user cards failed!', error);
          },
        });
    });
  }

  setSelectedCard(card: ICard) {
    console.log('Selected Card:', card);
    this.selectedCard = card;
  }

  showModal() {
    this.isModalVisible = true;
  }

  onModalClose() {
    this.isModalVisible = false;
  }

  fetchCards(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cardService
        .findCardsByUser({ user_id: this.user.id.toString() })
        .subscribe({
          next: (cards) => {
            this.cards = cards;
            this.cards.forEach((card) => {
              this.cardMap[card.uid] = card.user;
            });
            console.log('Card Map:', this.cardMap);
            resolve();
          },
          error: (err) => {
            console.error('Error fetching cards:', err);
            reject(err);
          },
        });
    });
  }

  requestAccess() {
    if (this.selectedCard) {
      console.log('Requesting access for card:', this.selectedCard);
    } else {
      console.log('No card selected.');
    }
  }

  fetchRoomReaders(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roomReaderService.getAllRoomReaders().subscribe({
        next: (readers: IRoomReader[]) => {
          this.roomReaders = readers;
          this.roomReaders.forEach((reader) => {
            this.readerMap[reader.uid] = reader.name;
          });
          console.log('Reader Map:', this.readerMap);
          resolve();
        },
        error: (err) => {
          console.error('Error fetching room readers:', err);
          reject(err);
        },
      });
    });
  }

  fetchEntryLogs(page: number, limit: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roomEntryLogService
        .findEntryLogsByFilter({
          page,
          limit,
          user_id: this.user.id,
        })
        .subscribe({
          next: (logs) => {
            console.log('Fetched Entry Logs:', logs);
            this.entryLogs = logs.map((log) => ({
              ...log,
              userid: this.cardMap[log.card],
              readerid: log.reader, // Assuming log.reader is reader UID
            }));
            resolve();
          },
          error: (err) => {
            console.error('Error fetching entry logs:', err);
            reject(err);
          },
        });
    });
  }
  // Function to change the page
  changePage(page: number) {
    this.currentPage = page;
    this.fetchCards()
      .then(() => this.fetchRoomReaders())
      .then(() => this.fetchEntryLogs(this.currentPage, 25));
  }

  onFilterChange() {
    this.currentPage = 1;
    this.fetchCards()
      .then(() => this.fetchRoomReaders())
      .then(() => this.fetchEntryLogs(this.currentPage, 25));
  }
}

export interface IFilter {
  id?: string | null;
  card_id?: string;
  username?: string;
  reader_id?: string;
  reader_name?: string;
  type?: string;
}