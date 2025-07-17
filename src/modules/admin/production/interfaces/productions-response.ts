export interface IProductionsResponse {
    orders: IProductionOrder[];
    meta: IProductionsResponseMeta;
}

export interface IProductionsResponseMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IProductionOrder {
    id: string;
    originBranchId: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    createdByUserId: string;
    updatedByUserId: string;
    deletedAt: null;
    deletedByUserId: null;
    recipeId: null;
    productionOrderDetails: IProductionOrderDetail[];
    createdByUser: IProductionAtedByUser;
    updatedByUser: IProductionAtedByUser;
    deliveryDate: Date | null;
    totalTime: number;
    productionWaste: IProductionWaste[];
}
export interface IProductionWaste {
    id: string;
    productionOrderId: string;
    productId: string;
    quantity: string;
    reason: string;
    reasonDescription: null;
    createdAt: Date;
    product: Product;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    unit: Unit;
    isEnable: boolean;
}

export interface Unit {
    name: string;
    abbreviation: string;
}


export interface IProductionAtedByUser {
    id: string;
    name: string;
    email: string;
    isEnable: boolean;
    createdAt: Date;
    updatedAt: Date;
    roleId: string;
    role: IProductionDetailRole;
    imageUrl: null;
}

export interface IProductionDetailRole {
    name: string;
    description: string;
}

export interface IProductionOrderDetail {
    id: string;
    productionOrderId: string;
    recipeId: string;
    quantity: string;
    parallelGroupId: string | null;
    isParallel: boolean;
    subTotalTime: 50;
    recipe: IProductionDetailRecipe;
    parallelGroup: ParallelGroup | null
}

export interface ParallelGroup {
    name: string;
}

export interface IProductionDetailRecipe {
    // id: string;
    name: string;
    slug: string;
    description: string;
    // createdAt: Date;
    // updatedAt: Date;
    // deletedAt: Date;
    // updatedByUserId: string;
    // createdByUserId: string;
    // deletedByUserId: null;
    // preparationInstructions: string;
    imageUrl: null;
    isEnable: boolean;
    preparationTime: number;
    items: IProductionDetailRecipeItem[];
}

export interface IProductionDetailRecipeItem {
    id: string;
    productId: string;
    quantity: string;
    recipeId: string;
    product: IRecipeItemProduct;
}

export interface IRecipeItemProduct {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    unit: {
        name: string;
        abbreviation: string;
    },
    isEnable: boolean;
}
