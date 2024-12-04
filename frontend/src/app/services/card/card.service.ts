import { Inject, Injectable } from '@angular/core';
import { API_URL } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardRoutes } from '../../shared/card/routes.enum';
import {
  ICard,
  IFindCardsByUserDto,
  IFindCardsByUserResponse,
} from '../../shared/card/find-cards-by-user.interface';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string
  ) {}

  findCardsByUser(
    findCardsByUserDto: IFindCardsByUserDto
  ): Observable<IFindCardsByUserResponse> {
    const findCardsByUserUrl = `${this.apiUrl}${CardRoutes.FIND_CARDS_BY_USER}`;
    return this.http.post<IFindCardsByUserResponse>(
      findCardsByUserUrl,
      findCardsByUserDto
    );
  }
  // Add the following methods

  getAllCards(): Observable<ICard[]> {
    const url = `${this.apiUrl}api/cards/`;
    return this.http.get<ICard[]>(url);
  }

  createCard(card: ICard): Observable<ICard> {
    const url = `${this.apiUrl}api/cards/`;
    return this.http.post<ICard>(url, card);
  }

  updateCard(uid: string, card: ICard): Observable<ICard> {
    const url = `${this.apiUrl}api/cards/${uid}/`;
    return this.http.put<ICard>(url, card);
  }

  deleteCard(uid: string): Observable<void> {
    const url = `${this.apiUrl}api/cards/${uid}/`;
    return this.http.delete<void>(url);
  }
}
