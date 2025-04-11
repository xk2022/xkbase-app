export interface Role {
    id: number;
    code: string;
    title: string;
    description: string;
    systemUuids: string[];
    orders: number;
}