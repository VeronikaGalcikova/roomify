import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../../app.config';
import { Observable } from 'rxjs';
import { IGetAllRoomReadersResponse } from '../../shared/room-reader/get-all-users.interface';
import { RoomReaderRoutes } from '../../shared/room-reader/routes.enum';

@Injectable({
  providedIn: 'root'
})
export class RoomReaderService {

  constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  getAllRoomReaders(): Observable<IGetAllRoomReadersResponse> {
    const getAllRoomReadersUrl = `${this.apiUrl}${RoomReaderRoutes.GET_ALL_ROOM_READERS}`;
    return this.http.get<IGetAllRoomReadersResponse>(getAllRoomReadersUrl);
  }
}
