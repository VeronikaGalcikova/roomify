// frontend/src/app/services/room-entry-log.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IRoomEntryLog {
  id: number;
  card: string; // UUID of the card
  userid: number; // ID of the user
  reader: string; // UUID of the room reader
  readerid: string;
  log_type: 'entry' | 'exit' | 'denied';
  timestamp: string; // ISO Date String
}

@Injectable({
  providedIn: 'root',
})
export class RoomEntryLogService {
  private apiUrl = 'http://localhost:8000/api/room-entry-logs/';

  constructor(private http: HttpClient) {}

  getEntryLogs(): Observable<IRoomEntryLog[]> {
    return this.http.get<IRoomEntryLog[]>(this.apiUrl);
  }

  createEntryLog(log: Partial<IRoomEntryLog>): Observable<IRoomEntryLog> {
    return this.http.post<IRoomEntryLog>(this.apiUrl, log);
  }

  updateEntryLog(
    id: number,
    log: Partial<IRoomEntryLog>
  ): Observable<IRoomEntryLog> {
    return this.http.put<IRoomEntryLog>(`${this.apiUrl}${id}/`, log);
  }

  deleteEntryLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
