export interface IFindCardsByUserResponse extends Array<ICard> {}

export interface IFindCardsByUserDto {
  user_id: string;
}

export interface ICard {
  uid: string;
  card_id: string;
  expiration_date: string;
  user: number;
  user_name: string;
}
