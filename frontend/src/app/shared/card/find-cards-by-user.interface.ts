export interface IFindCardsByUserResponse extends Array<ICard> {}

export interface IFindCardsByUserDto {
    user_id: string;
}

export interface ICard {
    uid: string;
    card_id: string;
    allowed: boolean;
    user: number;
}