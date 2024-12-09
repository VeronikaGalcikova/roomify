import { ICard } from "./find-cards-by-user.interface";

export interface IFindCardsByFilterResponse extends Array<ICard> {}

export interface IFindCardsByFilterDto {
  page: number;
  limit: number;
  user_id?: number;
  user_name?: string;
  card_id?: string;
  card_uid?: string;
}