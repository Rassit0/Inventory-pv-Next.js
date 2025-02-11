export interface IUserRolesResponse {
    roles: IUserRole[];
}

export interface IUserRole {
    id:          string;
    name:        string;
    description: string;
    users:       IUser[];
}

export interface IUser {
    email: string;
}
