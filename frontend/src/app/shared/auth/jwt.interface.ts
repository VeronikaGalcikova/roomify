export interface IJWTdata {
    exp: number;
    iat: number;
    jti: string;
    token_type: string;
    user_id: number;
    is_superuser: boolean;
}