export interface IRoomEntryLog {
    id: number;
    card: string;
    userid: number;
    reader: string;
    readerid: string;
    log_type: 'entry' | 'exit' | 'denied';
    timestamp: string;
}

export interface IFindEntryLogsByFilterDto {
    card_id?: string;
    reader_id?: string;
    type?: 'entry' | 'exit' | 'denied';
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
}

export interface IFindEntryLogsByFilterResponse extends Array<IRoomEntryLog> {}