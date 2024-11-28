import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardRoutes } from '../../shared/card/routes.enum';
import { IFindCardsByUserDto, IFindCardsByUserResponse } from '../../shared/card/find-cards-by-user.interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  findCardsByUser(findCardsByUserDto: IFindCardsByUserDto): Observable<IFindCardsByUserResponse> {
    const findCardsByUserUrl = `${this.apiUrl}${CardRoutes.FIND_CARDS_BY_USER}`;
    return this.http.post<IFindCardsByUserResponse>(findCardsByUserUrl, findCardsByUserDto);
  }
}
