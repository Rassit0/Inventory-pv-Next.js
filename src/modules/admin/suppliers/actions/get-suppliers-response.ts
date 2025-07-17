"use server"

import { valeryClient } from "@/lib/api"
import { ISupplier, ISuppliersResponse } from "@/modules/admin/suppliers";

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    searchName?: string | null;
    status?: string | null;
    orderBy?: 'asc' | 'desc' | null
    columnOrderBy?: 'name' | 'type' | 'address' | 'city' | 'state' | 'country' | 'createdAt' | null
    signal?: AbortSignal;
    supplierIds?: string[];
    filterSuppliersByProductId?: string;
}
export const getSuppliersResponse = async ({ token, columnOrderBy, limit, orderBy, page, search, status, signal, supplierIds, searchName, filterSuppliersByProductId }: Props): Promise<ISuppliersResponse | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (searchName) searchParams.append('searchName', searchName);
        if (status) searchParams.append('status', status);
        if (orderBy) searchParams.append('orderBy', orderBy);
        if (columnOrderBy) searchParams.append('columnOrderBy', columnOrderBy);
        if (filterSuppliersByProductId) searchParams.append('filterSuppliersByProductId', filterSuppliersByProductId);

        // Si supplierIds se proporciona, se agrega a la URL usando un forEach
        let data = null;
        if (supplierIds && supplierIds.length > 0) {
            data = {
                supplierIds
            }
            // supplierIds.forEach((id) => {
            //     searchParams.append('supplierIds', id); // Agrega cada id de productIds como un parámetro individual
            // });
        }
        console.log(data ? JSON.stringify(data) : undefined)

        // Construir la URL con los parámetros de consulta
        const url = `/suppliers${data ? '/by-ids' : ''}?` + searchParams.toString();

        const response = await valeryClient<ISuppliersResponse>(url, {
            method: data ? 'POST' : 'GET',
            headers: {
                ...(data && { 'Content-Type': 'application/json', }),
                Authorization: 'Bearer ' + token,
            },
            signal,
            body: data ? JSON.stringify(data) : undefined,
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
    } catch (error: any) {
        if (error.name === "AbortError") {
            // eslint-disable-next-line no-console
            console.log("Fetch aborted");
        } else {
            console.log(error);
        }
        return null;
    }
}