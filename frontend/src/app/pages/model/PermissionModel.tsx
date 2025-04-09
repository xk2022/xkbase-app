export interface PermissionUpdate {
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    active: boolean;
    actions: Action[] | null;
    permissions: Permission[] | null;
}

export interface Action {
    id: number;
    name: string;
    active: boolean;
}