export interface IBranchesResponse {
    branches: IBranch[];
}

export interface IBranch {
    id: string;
    name: string;
    location: string;
    phone: null | string;
    email: null | string;
    managerId: string;
    latitude: number;
    longitude: number;
    imageUrl: null | string;
    isEnable: boolean;
    createdaAt: Date;
    updatedAt: Date;
    manager: IBranchManager;
    warehouses: IBranchWarehouse[];
}

export interface IBranchManager {
    id: string;
    name: string;
    email: string;
    isEnable: boolean;
    createdAt: Date;
    updatedAt: Date;
    roleId: string;
    role: IBranchManagerRole;
    imageUrl: null;
}

export interface IBranchManagerRole {
    name: string;
    description: string;
}

export interface IBranchWarehouse {
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
    deletedAt: null;
}
