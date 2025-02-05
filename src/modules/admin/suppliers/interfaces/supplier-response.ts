export interface ISupplierResponse {
    suppliers: ISupplier[];
}

export interface ISupplier {
    id: string;
    name: string;
    address: null | string;
    city: null | string;
    state: null | string;
    country: null | string;
    zipCode: null | string;
    websiteUrl: null | string;
    taxId: null | string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    contactInfo: ISupplierContactInfo[];
}

export interface ISupplierContactInfo {
    id: number;
    supplierId?: string;
    contactName: string;
    email: null | string;
    phoneNumber: null | string;
    phoneType: null | 'MOBILE' | 'LANDLINE' | 'WHATSAPP' | 'OTHER';
    position: 'SALES' | 'SUPPORT' | 'MANAGER' | 'ADMINISTRATOR' | 'OTHER';
    isPrimary: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
