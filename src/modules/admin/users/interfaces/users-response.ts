export interface IUsersResponse {
    users: IUser[];
    meta:  IUsersResponseMeta;
}

export interface IUsersResponseMeta {
    totalItems:   number;
    itemsPerPage: number;
    totalPages:   number;
    currentPage:  number;
}

export interface IUser {
    id:        string;
    name:      string;
    email:     string;
    isEnable:  boolean;
    createdAt: Date;
    updatedAt: Date;
    roleId:    string;
    role:      IUserRole;
    imageUrl:  null;
}

export interface IUserRole {
    name:        string;
    description: string;
}
