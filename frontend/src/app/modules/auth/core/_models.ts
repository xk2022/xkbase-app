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
  permissionCodes?: string[]; // 後端返回的權限碼列表
  roleCodes?: string[]; // 後端返回的角色碼列表
}
