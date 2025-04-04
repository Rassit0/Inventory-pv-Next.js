import { ParentModule } from '../../user-roles/interfaces/roles-response';
export interface IUsersResponse {
    users: IUser[];
    meta: IUsersResponseMeta;
}

export interface IUsersResponseMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    isEnable: boolean;
    hasGlobalBranchesAccess: boolean;
    createdAt: Date;
    updatedAt: Date;
    roleId: string;
    role: Role;
    userBranches: IUserBranch[];
    imageUrl: null;
}

export interface Role {
    name: string;
    description: string;
    roleModule: RoleModule[];
}

export interface RoleModule {
    module: Module;
    roleModulePermission: RoleModulePermission[];
}

export interface Module {
    name: string;
    ParentModule: string | null;
}

export interface RoleModulePermission {
    permission: Permission;
}

export interface Permission {
    name: string;
}
export enum namePermission {
    Delete = "DELETE",
    Edit = "EDIT",
    Manage = "MANAGE",
    Read = "READ",
    Write = "WRITE",
}

export interface IUserBranch {
    branchId: string;
    branch: Branch;
}

export interface Branch {
    id: string;
    name: string;
    location: string;
    phone: string;
    email: string;
    managerId: null;
    latitude: null;
    longitude: null;
    imageUrl: null;
    isEnable: boolean;
    createdaAt: Date;
    updatedAt: Date;
}
