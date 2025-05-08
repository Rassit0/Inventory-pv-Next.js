export interface IPersonsResponse {
    persons: IPerson[];
    meta: IPersonsResponseMeta;
}

export interface IPersonsResponseMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface IPerson {
    id: string;
    name: string;
    lastname: string;
    secondLastname: string | null;
    nit: string;
    imageUrl: null | string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null | Date;
    updatedByUserId: string;
    createdByUserId: string;
    deletedByUserId: null | string;
}
