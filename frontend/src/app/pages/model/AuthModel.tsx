export interface Auth {
    uuid: string;
    username: string;
    email: string;
    cellPhone: string;
    roleUuid: string;
    enabled: boolean;
    locked: boolean;
    accessToken: string;
    systemDTOs: SystemDTO[] | null;
}

export interface SystemDTO {
    systemUuid: string;
    name: string;
}

export interface PermissionDTO {
    id: number;
    name: string;
    active: boolean;
    permissionDTOs: PermissionDTO[] | null;
    actions: Action[] | null;
}

export interface Action {
    id: string;
    name: string;
    active: boolean;
}