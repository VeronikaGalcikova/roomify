import {
  RoomEntryLogService,
} from './../../../services/room-entry-logs/room-entry-log.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user/user.service';
import { CardService } from '../../../services/card/card.service';
import { IUser } from '../../../shared/user/get-all-users.interface';
import { ICard } from '../../../shared/card/find-cards-by-user.interface';
import { RoomReaderService } from '../../../services/room-reader/room-reader.service';
import { IRoomReader } from '../../../shared/room-reader/get-all-room-readers.interface';
import { FormsModule } from '@angular/forms';
import { IRoomEntryLog } from '../../../shared/entry-log/entry-log.interface';


@Component({
  selector: 'app-last-accesses',
  templateUrl: './last-accesses.component.html',
  styleUrls: ['./last-accesses.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
})
export class LastAccessesComponent implements OnInit {
  entryLogs: IRoomEntryLog[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  selectedLog: IRoomEntryLog | null = null;
  newLog: Partial<IRoomEntryLog> = {
    card: '',
    reader: '',
    log_type: 'entry',
  };
  users: IUser[] = [];
  userMap: { [key: number]: string } = {};
  cards: ICard[] = [];
  cardMap: { [key: string]: number } = {}; // card.uid to user.id
  roomReaders: IRoomReader[] = [];
  readerMap: { [key: string]: string } = {}; // reader.uid to reader.name
  
  filter: IFilter = {
    id: null,
    username: '',
    card_id: '',
    reader_id: '',
    reader_name: '',
    type: '',
  };
  currentPage: number = 1;

  constructor(
    private roomEntryLogService: RoomEntryLogService,
    private cardService: CardService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private roomReaderService: RoomReaderService
  ) {}

  ngOnInit(): void {
    this.fetchUsers()
      .then(() => this.fetchCards())
      .then(() => this.fetchRoomReaders())
      .then(() => this.fetchEntryLogs(1, 25))
      .catch((error) => {
        console.error('Initialization error:', error);
      });
  }

  fetchUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.users = users;
          this.users.forEach((user) => {
            this.userMap[user.id] = user.username;
          });
          console.log('User Map:', this.userMap);
          resolve();
        },
        error: (err) => {
          this.errorMessage = 'Failed to load users.';
          this.showSnackBar(this.errorMessage, 'error');
          reject(err);
        },
      });
    });
  }

  fetchCards(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cardService.getAllCards().subscribe({
        next: (cards) => {
          this.cards = cards;
          this.cards.forEach((card) => {
            this.cardMap[card.uid] = card.user;
          });
          console.log('Card Map:', this.cardMap);
          resolve();
        },
        error: (err) => {
          this.errorMessage = 'Failed to load cards.';
          this.showSnackBar(this.errorMessage, 'error');
          reject(err);
        },
      });
    });
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
          this.errorMessage = 'Failed to load room readers.';
          this.showSnackBar(this.errorMessage, 'error');
          reject(err);
        },
      });
    });
  }

  fetchEntryLogs(page: number, limit: number): void {
    this.roomEntryLogService.getEntryLogs().subscribe({
      next: (logs) => {
        console.log('Fetched Entry Logs:', logs);
        this.entryLogs = logs.map((log) => ({
          ...log,
          userid: this.cardMap[log.card],
          readerid: log.reader, // Assuming log.reader is reader UID
        }));
      },
      error: (err) => {
        this.errorMessage = 'Failed to load entry logs.';
        this.showSnackBar(this.errorMessage, 'error');
      },
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass:
        type === 'success' ? ['snackbar-success'] : ['snackbar-error'],
    });
  }

  // Function to change the page
  changePage(page: number) {
    this.currentPage = page;
    this.fetchUsers()
      .then(() => this.fetchCards())
      .then(() => this.fetchRoomReaders())
      .then(() => this.fetchEntryLogs(page, 25))
    }

  onFilterChange() {
    this.currentPage = 1;
    this.fetchUsers()
      .then(() => this.fetchCards())
      .then(() => this.fetchRoomReaders())
      .then(() => this.fetchEntryLogs(this.currentPage, 25))
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
