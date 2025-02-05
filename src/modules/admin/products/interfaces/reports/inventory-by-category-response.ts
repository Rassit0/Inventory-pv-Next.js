export interface IInventoryByCategory {
    reportName:          string;
    inventoryByCategory: InventoryByCategory[];
}

export interface InventoryByCategory {
    id:          string;
    name:        string;
    description: string;
    slug:        string;
    imageUrl:    null | string;
    createdAt:   Date;
    updatedAt:   Date;
    products:    IInventoryByCategoryProduct[];
}

export interface IInventoryByCategoryProduct {
    id:    string;
    imageUrl:    null | string;
    name:  string;
    stock: string;
    unit:  IInventoryByCategoryUnit;
}

export interface IInventoryByCategoryUnit {
    name:         string;
    abbreviation: string;
}
