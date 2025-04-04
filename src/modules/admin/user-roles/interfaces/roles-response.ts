export interface IUserRolesResponse {
    roles: IRole[];
}

export interface IRole {
    id:          string;
    name:        string;
    description: string;
    roleModule:  IRoleModule[];
    users:       IUser[];
}

export interface IRoleModule {
    module:               IModule;
    roleModulePermission: IRoleModulePermission[];
}

export interface IModule {
    name:         string;
    parentModule: ParentModule | null;
}

export interface ParentModule {
    name: string;
}

export enum Name {
    Delete = "DELETE",
    Edit = "EDIT",
    Inventory = "INVENTORY",
    Manage = "MANAGE",
    Production = "PRODUCTION",
    Read = "READ",
    Suppliers = "SUPPLIERS",
    Write = "WRITE",
}

export interface IRoleModulePermission {
    permission: ParentModule;
}

export interface IUser {
    email: string;
}
