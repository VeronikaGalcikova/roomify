export interface IRoomEntryLog {
    id: number;
    card: string;
    card_id: string;
    userid: number;
    reader: string;
    reader_name: string;
    readerid: string;
    log_type: 'entry' | 'exit' | 'denied';
    timestamp: string;
}

export interface IFindEntryLogsByFilterDto {
    card_id?: string;
    user_id?: number;
    reader_id?: string;
    type?: 'entry' | 'exit' | 'denied';
    page: number;
    limit: number;
}

export interface IFindEntryLogsByFilterResponse extends Array<IRoomEntryLog> {}