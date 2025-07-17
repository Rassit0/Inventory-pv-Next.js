export interface IRecipesResponse {
    recipes: IRecipe[];
    meta: IRecipesResponseMeta;
}

export interface IRecipesResponseMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IRecipe {
    id: string;
    name: string;
    slug: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    updatedByUserId: string;
    createdByUserId: string;
    deletedByUserId: string | null;
    preparationInstructions: string;
    imageUrl: null;
    isEnable: boolean;
    preparationTime: number;
    items: IRecipeItem[];
    ProductionDetail?: IRecipeProductionDetail[];
    createdByUser: IRecipeAtedByUser;
    updatedByUser: IRecipeAtedByUser;
    deletedByUser: IRecipeAtedByUser | null;
}

export interface IRecipeProductionDetail {
    id: string;
    productionId: string;
    recipeId: string;
    quantity: string;
    production: IRecipeProductionDetailProduction;
}

export interface IRecipeProductionDetailProduction {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    createdByUserId: string;
    updatedByUserId: string;
    deletedAt: null;
    deletedByUserId: null;
    recipeId: null;
}

export interface IRecipeAtedByUser {
    id: string;
    name: string;
    email: string;
    isEnable: boolean;
    roleId: string;
    // imageUrl: null;
}

export interface IRecipeAtedByUserRole {
    name: string;
    description: string;
}

export interface IRecipeItem {
    id: string;
    productId: string;
    quantity: string;
    recipeId: string;
    product: IRecipeItemProduct;
}

export interface IRecipeItemProduct {
    id:              string;
    name:            string;
    description:     string;
    slug:            string;
    imageUrl:        string;
    isEnable:        boolean;
    minimumStock:    string;
    reorderPoint:    string;
    unitId:          string;
    createdAt:       Date;
    updatedAt:       Date;
    deletedAt:       null;
    createdByUserId: string;
    updatedByUserId: null;
    deletedByUserId: null;
    unit:            Unit;
}

export interface Unit {
    abbreviation: string;
    name:         string;
}


