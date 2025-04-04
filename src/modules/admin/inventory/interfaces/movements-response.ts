export interface IMovementsResponse {
    transactions: ITransaction[];
    meta: IMovementsResponseMeta;
}

export interface IMovementsResponseMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface ITransaction {
    id: string;
    movementType: ITransactionMovementType;
    adjustmentType: ITransactionMovementType | null;
    referenceType: null;
    status: Status;
    createdByUserId: string;
    updatedByUserId: null | string;
    createdAt: Date;
    entryDate: Date | null;
    updatedAt: Date;
    inventoryTransactionProducts: InventoryMovementProduct[];
    createdByUser: AtedByUser;
    updatedByUser: AtedByUser | null;
}

export interface AtedByUser {
    name: string;
    email: string;
}

export interface InventoryMovementProduct {
    id: string;
    inventoryTransactionId: string;
    productId: string;
    product: IInventoryProduct;
    unit: string;
    branchStockId: null | string;
    warehouseStockId: null | string;
    branchStock: Stock | null;
    warehouseStock: Stock | null;
}

export interface IInventoryProduct {
    name: string;
}

export interface Stock {
    id?: string;
    originBranchId?: null | string;
    originWarehouseId?: null | string;
    branchId?: string;
    quantity?: string;
    updatedAt?: Date;
    originBranch: Branch | null;
    originWarehouse: Branch | null;
    branch?: Branch | null;
    warehouseId?: string;
    warehouse?: Branch | null;
}

export interface Branch {
    name: string;
}

export enum ITransactionMovementType {
    Income = "INCOME",
    Outcome = "OUTCOME",
    Transfer = "TRANSFER",
    Adjustment = "ADJUSTMENT",
}

export enum Status {
    Completed = "COMPLETED",
    Pending = "PENDING",
    Accepted = "ACCEPTED",
    Canceled = "CANCELED",
}









