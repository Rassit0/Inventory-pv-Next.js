export interface IWarehousesResponse {
    warehouses: IWarehouse[];
    meta: IWarehouseMeta;
}

export interface IWarehouseMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IWarehouse {
    id: string;
    name: string;
    slug: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    imageUrl: null | string;
    isEnable: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    branches: IWarehouseBranch[];
}

export interface IWarehouseBranch {
    branchId: string;
    details: IWarehouseBranchDetails | null;
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
