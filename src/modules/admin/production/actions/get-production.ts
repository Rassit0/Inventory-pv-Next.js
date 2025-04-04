"use server"

import { valeryClient } from "@/lib/api"
import { IProduction, IProductionsResponse } from "@/modules/admin/production";

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
    branchId?: string;
    orderBy?: 'asc' | 'desc' | null
    columnOrderBy?: 'updatedAt' | 'deliveryDate' | 'createdAt' | null
    date?: Date;
    // searchBranchId?: string;
    // searchWarehouseId?: string;
}

export const getProductions = async ({ token, limit, page, search, status, branchId, columnOrderBy, orderBy, date }: Props): Promise<IProductionsResponse> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);
        if (orderBy) searchParams.append('orderBy', orderBy);
        if (columnOrderBy) searchParams.append('columnOrderBy', columnOrderBy);
        if (branchId) searchParams.append('branchId', branchId);
        // if (date) searchParams.append('date', date.toISOString());
        // if (date) date.setHours(0, 0, 0, 0);
        // if (searchWarehouseId) searchParams.append('warehouseId', searchWarehouseId);

        // Construir la URL con los parámetros de consulta
        const url = '/production?' + searchParams.toString() + (searchParams.toString() === '' ? '' : date ? '&date=' + date.toISOString() : '');
        console.log(url)
        const response = await valeryClient<IProductionsResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const productions = response.productions.map((product: IProduction) => ({
            ...product,
            // ...(product.lastSaleDate && { lastSaleDate: new Date(product.lastSaleDate) }),
            // ...(product.launchDate && { launchDate: new Date(product.launchDate) }),
            // ...(product.expirationDate && { expirationDate: new Date(product.expirationDate) }),
            deliveryDate: product.deliveryDate ? new Date(product.deliveryDate) : null,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt)
        }));

        return {
            productions,
            meta: response.meta
        };
    } catch (error) {
        console.log(error);
        return {
            productions: [],
            meta: {
                currentPage: 1,
                itemsPerPage: 0,
                totalItems: 0,
                totalPages: 1,
            }
        };
    }
}