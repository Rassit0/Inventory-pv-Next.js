"use server"

import { valeryClient } from "@/lib/api"
import { ISupplier, ISupplierResponse } from "@/modules/admin/suppliers";

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
    orderBy?: 'asc' | 'desc' | null
    columnOrderBy?: 'name' | 'lastname' | 'secondLastname' | 'nit' | null
    signal?: AbortSignal;
}
export const getSuppliersResponse = async ({ token, columnOrderBy, limit, orderBy, page, search, status, signal }: Props): Promise<ISupplierResponse | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);
        if (orderBy) searchParams.append('orderBy', orderBy);
        if (columnOrderBy) searchParams.append('columnOrderBy', columnOrderBy);

        // Construir la URL con los parámetros de consulta
        const url = '/suppliers?' + searchParams.toString();

        const response = await valeryClient<ISupplierResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        const suppliers = response.suppliers.map(supplier => ({
            ...supplier,
            createdAt: new Date(supplier.createdAt),
            updatedAt: new Date(supplier.updatedAt),
            deletedAt: supplier.deletedAt ? new Date(supplier.deletedAt) : null
        }));

        return {
            ...response,
            suppliers
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}