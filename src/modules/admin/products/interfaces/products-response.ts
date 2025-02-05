// import { ISimpleProduct } from "./simple-product";

// export interface IProductsResponse {
//     products: ISimpleProduct[];
//     meta: Meta
// }

// export interface Meta {
//     totalItems: number;
//     totalPages: number;
//     currentPage: number;
// }


export interface IProductResponse {
    products: IProduct[];
    meta:     IProductResponseMeta;
}

export interface IProductResponseMeta {
    totalItems:     number;
    itemsPerPage:   number
    totalPages:     number;
    currentPage:    number;
}

export interface IProduct {
    id:                     string;
    name:                   string;
    description:            string;
    slug:                   string;
    type:                   string;
    price:                  string;
    imageUrl?:              string | null;
    lastSaleDate?:          Date | null;
    launchDate?:            Date | null;
    expirationDate?:        Date | null;
    isEnable:               boolean;
    unitId:                 string;
    purchasePrice:          string;
    seasonId?:              string | null;
    createdAt:              Date;
    updatedAt:              Date;
    unit:                   IProductUnit;
    categories:             IProductCategory[];
    composesProducts:       IComposesProduct[];
    composedByProducts:     IComposedByProduct[];
    branchProductInventory: IBranchProductInventory[];
}

export interface IComposesProduct {
    product:  IComposedByProductChildren;
    quantity: string;
}

export interface IComposedByProduct {
    componentProduct:  IComposedByProductChildren;
    quantity: string;
}

export interface IComposedByProductChildren {
    id:   string;
    name: string;
    unit: IComposedByProductChildrenUnit;
}

export interface IComposedByProductChildrenUnit {
    name:         string;
    abbreviation: string;
}

export interface IBranchProductInventory {
    id?:                   string;
    productId?:            string;
    branchId:              string;
    stock:                 string;
    updatedAt?:             Date;
    minimumStock:          string;
    reorderPoint:          string;
    warehouseId?:          string;
    lastStockUpdate:       Date;
    purchasePriceOverride?: string | null;
    priceOverride?:         string | null;
}

export interface IProductCategory {
    id:          string;
    name:        string;
    description: string;
    slug:        string;
    imageUrl?:   string | null;
    createdAt:   Date;
    updatedAt:   Date;
}

export interface IProductUnit {
    id:           string;
    name:         string;
    abbreviation: string;
    createdAt:    Date;
    updatedAt:    Date;
}
