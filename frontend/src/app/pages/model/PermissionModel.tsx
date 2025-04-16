export interface PermissionUpdate {
    permissions: Permission[];
}

export interface Permission {
    uuid: string;
    name: string;
    active: boolean;
    actions: Action[] | null;
    permissions: Permission[] | null;
}

export interface Action {
    uuid: string;
    name: string;
    active: boolean;
}