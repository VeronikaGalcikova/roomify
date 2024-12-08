import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IFindEntryLogsByFilterDto,
  IFindEntryLogsByFilterResponse,
  IRoomEntryLog,
} from '../../shared/entry-log/entry-log.interface';
import { API_URL } from '../../app.config';
import { EntryLogRoutes } from '../../shared/entry-log/routes.enum';

@Injectable({
  providedIn: 'root',
})
export class RoomEntryLogService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  getEntryLogs(): Observable<IRoomEntryLog[]> {
    const getEntryLogsUrl = `${this.apiUrl}${EntryLogRoutes.GET_ALL_ENTRY_LOGS}`;
    return this.http.get<IRoomEntryLog[]>(getEntryLogsUrl);
  }

  findEntryLogsByFilter(
    findEntryLogsByFilterDto: IFindEntryLogsByFilterDto
  ): Observable<IFindEntryLogsByFilterResponse> {
    const findEntryLogsByFilterUrl = `${this.apiUrl}${EntryLogRoutes.FIND_ENTRY_LOGS_BY_FILTER}`;
    return this.http.post<IFindEntryLogsByFilterResponse>(
      findEntryLogsByFilterUrl,
      findEntryLogsByFilterDto
    );
  }
}
