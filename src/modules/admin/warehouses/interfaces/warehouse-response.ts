export interface IWarehousesResponse {
    warehouses: IWarehouse[];
}

export interface IWarehouse {
    id: string;
    name: string;
    slug: string;
    location: string;
    latitude: number;
    longitude: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    branches: IWarehouseBranch[];
    usersAccess: IWarehouseUsersAccess[];
}

export interface IWarehouseBranch {
    branchId: string;
    details: IWarehouseBranchDetails;
}

export interface IWarehouseBranchDetails {
    id: string;
    name: string;
    location: string;
    phone: null | string;
    email: null | string;
    managerId: string;
    latitude: number | null;
    longitude: number;
    imageUrl: null | string;
    isEnable: boolean;
    createdaAt: Date;
    updatedAt: Date;
}

export interface IWarehouseUsersAccess {
    userId: string;
    role: string;
}
