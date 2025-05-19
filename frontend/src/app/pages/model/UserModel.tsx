export interface User {
    uuid: string;
    account: string;
    username: string;
    email: string;
    cellPhone: string;
    roleUuid: string;
    password: string;
    enabled: boolean;
    locked: boolean;
    lastLogin: string;
}
