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
    type: string;
    price: string;
    imageUrl: null | string;
    lastSaleDate: Date | null;
    launchDate: Date | null;
    expirationDate: Date | null;
    isEnable: boolean;
    unitId: string;
    purchasePrice: string;
    seasonId: null;
    createdAt: Date;
    updatedAt: Date;
    unit: Unit;
    categories: IProductCategory[];
    branchProductInventory: IBranchProductInventory[];
}

export interface IBranchProductInventory {
    id?: string;
    productId?: string;
    branchId: string;
    stock: string;
    updatedAt?: Date;
    minimumStock: string;
    reorderPoint: string;
    warehouseId?: null | string;
    lastStockUpdate: Date;
    purchasePriceOverride: null | string;
    priceOverride: null;
}

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
