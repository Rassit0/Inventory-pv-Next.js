import { IRole } from "@/modules/admin/user-roles";

export interface IAuthSessionResponse {
    user: IUser;
    token: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    imageUrl: null;
    isEnable: boolean;
    roleId: string;
    createdAt: Date;
    updatedAt: Date;
    hasGlobalBranchesAccess: boolean;
    role?: IRole | null;
}
