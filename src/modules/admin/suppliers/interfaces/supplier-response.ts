export interface ISuppliersResponse {
    suppliers: ISupplier[];
    meta: ISuppliersResponseMeta;
}

export interface ISuppliersResponseMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface ISupplier {
    id: string;
    type: 'INDIVIDUAL'|'COMPANY'
    personId: string | null;
    person: ISupplierPerson | null;
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
    lastname: string;
    secondLastname: string | null;
    email: null | string;
    phoneNumber: null | string;
    phoneType: null | 'MOBILE' | 'LANDLINE' | 'WHATSAPP' | 'OTHER';
    position: 'SALES' | 'SUPPORT' | 'MANAGER' | 'ADMINISTRATOR' | 'OTHER';
    isPrimary: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISupplierPerson {
    id: string;
    name: string;
    lastname: string;
    secondLastname: null;
    nit: string;
    imageUrl: null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    updatedByUserId: string;
    createdByUserId: string;
    deletedByUserId: null;
}

