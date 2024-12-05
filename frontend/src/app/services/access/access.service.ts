import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ROOM_READER_URL } from '../../app.config';
import { Observable } from 'rxjs';
import { IVerifyDto, IVerifyResponse } from '../../shared/access/verify.interface';
import { AccessRoutes } from '../../shared/access/routes.enum';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private http: HttpClient, @Inject(ROOM_READER_URL) private apiUrl: string) { }

  verify(verifyDto: IVerifyDto): Observable<IVerifyResponse> {
    const loginUrl = `${this.apiUrl}${AccessRoutes.VERIFY}`;
    return this.http.post<IVerifyResponse>(loginUrl, verifyDto);
  }
}
