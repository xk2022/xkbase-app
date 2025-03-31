export interface User {
    id: number;
    username: string;
    email: string;
    cellPhone: string;
    roleId: number;
    password: string;
    enabled: boolean;
    locked: boolean;
    lastLogin: string;
}
