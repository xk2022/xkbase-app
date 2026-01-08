export interface PermissionAction {
  id: number;
  name: string;
  active: boolean;
}

export interface PermissionDTO {
  id: number;
  name: string;
  active: boolean;
  actions: PermissionAction[];
}

export interface SystemDTO {
  systemUuid: string;
  name: string;
  permissionDTOS: PermissionDTO[];
}

export interface UserModel {
  uuid: string;
  account: string,
  name: string,
  username: string;
  fullname: string;
  email: string;
  cellPhone: string;
  roleUuid: string;
  enabled: boolean;
  locked: boolean;
  token: string;
  systemDTOs: SystemDTO[] | null;
}
