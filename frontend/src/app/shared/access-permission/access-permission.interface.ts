export interface IAccessPermission {
    id: number;
    status: 'allowed' | 'not_allowed' | 'pending';
    card: string;
    card_id: string;
    room_reader: string;
    room_reader_name: string;
    user_id: string;
    user_name: string;
}