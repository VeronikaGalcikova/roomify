import { ICard } from "./find-cards-by-user.interface";

export interface IFindCardsByFilterResponse extends Array<ICard> {}

export interface IFindCardsByFilterDto {
  user_id: string;
}