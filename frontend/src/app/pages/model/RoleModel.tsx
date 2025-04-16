export interface Role {
    uuid: string;
    code: string;
    title: string;
    description: string;
    systemUuids: string[];
    orders: number;
}