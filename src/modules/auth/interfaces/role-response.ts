export interface IRolesResponse {
    roles: IRole[];
}

export interface IRole {
    id: string;
    name: string;
    description: string;
    roleModule: IRoleModule[];
    users: IRoleUser[];
}

export interface IRoleModule {
    module: string;
    roleModulePermission: IRoleModulePermission[];
}

export interface IRoleModulePermission {
    permission: RoleModulePermission;
}

export enum RoleModulePermission {
    Delete = "DELETE",
    Edit = "EDIT",
    Manage = "MANAGE",
    Read = "READ",
    Write = "WRITE",
}

export interface IRoleUser {
    email: string;
}
