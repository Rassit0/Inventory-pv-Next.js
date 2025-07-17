import { WarehouseIcon } from 'hugeicons-react';
export interface IProductsResponse {
    products: IProduct[];
    meta: Meta;
}

export interface Meta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IProduct {
    id: string;
    name: string;
    description: string;
    slug: string;
    // price: string;
    minimumStock: string,
    reorderPoint: string,
    imageUrl: null | string;
    // lastSaleDate: Date | null;
    launchDate: Date | null;
    expirationDate: Date | null;
    isEnable: boolean;
    unitId: string;
    purchasePrice: string;
    seasonId: null;
    createdAt: Date;
    updatedAt: Date;
    unit: Unit;
    types: IProductTypes[];
    categories: IProductCategory[];
    locationProductStock: ILocationProductStock[];
    // branchProductStock: IBranchProductStock[];
    // warehouseProductStock: IWarehouseProductStock[];
    suppliers: ISupplierProduct[];
}

export interface ISupplierProduct {
    supplierId: string;
}

export interface ILocationProductStock {
    id: string;
    productId: string;
    locationId: string;
    locationType: "BRANCH" | "WAREHOUSE";
    stock: string;
    updatedAt?: Date;
    branch: {
        name: string;
    } | null;
    warehouse: {
        name: string;
    } | null;
}

// export interface IBranchProductStock {
//     id?: string;
//     productId?: string;
//     branchId: string;
//     stock: string;
//     updatedAt?: Date;
//     nameBranch: string | null
// }
// export interface IWarehouseProductStock {
//     id?: string;
//     productId?: string;
//     warehouseId: string;
//     stock: string;
//     updatedAt?: Date;
//     nameWarehouse: string | null;
// }

export interface IProductCategory {
    id: string;
    name: string;
    description: string;
    slug: string;
    imageUrl: null | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Unit {
    id: string;
    name: string;
    abbreviation: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductTypes {
    id: string;
    productId: string;
    type: "RawMaterial" | "FinalProduct" | "Ingredient" | "Recipe";
}
