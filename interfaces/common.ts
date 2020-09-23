export interface CONFIG {
	TOKEN: string
    DOMAIN: string
    USE_HTL: string
    AUTOFOLLOW: string
    DB_TABLE: string
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_DATABASE: string
}

export interface TABLE_INSERT {
    Acct: string
    URL: string
    StatusCreatedAt: string
    GetAt: string
    Date: string
}
export interface TABLE extends TABLE_INSERT {
    ID: number
}
export interface HIMARUN_MAP {
    [key: string]: number
}