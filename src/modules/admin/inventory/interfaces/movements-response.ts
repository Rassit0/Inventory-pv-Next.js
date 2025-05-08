export interface IMovementsResponse {
    movements: IMovement[];
    meta: IMovementsResponseMeta;
}

export interface IMovementsResponseMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IMovement {
    id: string;
    movementType: EMovementType;
    adjustment: IMovementAdjustment | null;
    referenceType: null;
    status: EMovementStatus;
    createdByUserId: string;
    updatedByUserId: null | string;
    createdAt: Date;
    deliveryDate: Date | null;
    updatedAt: Date;
    inventoryMovementDetails: IMovementDetail[];
    createdByUser: AtedByUser;
    updatedByUser: AtedByUser | null;
    originBranchId: null | string;
    originWarehouseId: null | string;
    originBranch: IMovementBranchOrWarehouse | null;
    originWarehouse: IMovementBranchOrWarehouse | null;
    destinationBranchId: null | string;
    destinationWarehouseId: null | string;
    destinationBranch: IMovementBranchOrWarehouse | null;
    destinationWarehouse: IMovementBranchOrWarehouse | null;
}

export interface IMovementAdjustment {
    id: string;
    inventoryMovementId: string;
    adjustmentType: EAdjustmentType;
    otherAdjustmentReason: string | null;
}

export interface AtedByUser {
    name: string;
    email: string;
}

export interface IMovementDetail {
    id: string;
    inventoryTransactionId: string;
    productId: string;
    product: IMovmentDetailProduct | null;
    unit: string;
    expectedQuantity: string;
    deliveredQuantity?: string;
    deliveryStatus: EDeliveryStatusDetail;
    updatedAt: Date;
}

export interface IMovmentDetailProduct {
    name: string;
    imageUrl: string | null;
}

export interface IMovementBranchOrWarehouse {
    name: string;
}

export enum EMovementType {
    Income = "INCOME",
    Outcome = "OUTCOME",
    Transfer = "TRANSFER",
    Adjustment = "ADJUSTMENT",
}

export enum EAdjustmentType {
    Income = "INCOME",
    Outcome = "OUTCOME",
}

export enum EDeliveryStatusDetail {
    PENDING = 'PENDING', // Pendiente de entrega
    COMPLETE = 'COMPLETE', // Entregado completamente
    PARTIAL = 'PARTIAL', // Entregado parcialmente
    NOT_DELIVERED = 'NOT_DELIVERED', // No entregado
    OVER_DELIVERED = 'OVER_DELIVERED', // Entregado en exceso
}


export enum EMovementStatus {
    Completed = "COMPLETED",
    Pending = "PENDING",
    Accepted = "ACCEPTED",
    Canceled = "CANCELED",
}









