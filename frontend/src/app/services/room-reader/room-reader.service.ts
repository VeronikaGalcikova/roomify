import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../../app.config';
import { Observable } from 'rxjs';
import {
  IGetAllRoomReadersResponse,
  IRoomReader,
} from '../../shared/room-reader/get-all-users.interface';
import { RoomReaderRoutes } from '../../shared/room-reader/routes.enum';

@Injectable({
  providedIn: 'root',
})
export class RoomReaderService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  getAllRoomReaders(): Observable<IGetAllRoomReadersResponse> {
    const getAllRoomReadersUrl = `${this.apiUrl}${RoomReaderRoutes.GET_ALL_ROOM_READERS}`;
    return this.http.get<IGetAllRoomReadersResponse>(getAllRoomReadersUrl);
  }

  createRoomReader(roomReader: Partial<IRoomReader>): Observable<IRoomReader> {
    const url = `${this.apiUrl}api/room-readers/`;
    return this.http.post<IRoomReader>(url, roomReader);
  }

  updateRoomReader(
    uid: string,
    roomReader: Partial<IRoomReader>
  ): Observable<IRoomReader> {
    const url = `${this.apiUrl}api/room-readers/${uid}/`;
    return this.http.put<IRoomReader>(url, roomReader);
  }

  deleteRoomReader(uid: string): Observable<void> {
    const url = `${this.apiUrl}api/room-readers/${uid}/`;
    return this.http.delete<void>(url);
  }
}
