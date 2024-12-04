export interface IFindCardsByUserResponse extends Array<ICard> {}

export interface IFindCardsByUserDto {
  user_id: string;
}

export interface ICard {
  id: number;
  uid: string;
  card_id: string;
  allowed: boolean;
  user: number;
}
