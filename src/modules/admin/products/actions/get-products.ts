"use server"

import { valeryClient } from "@/lib/api"
import { IProduct, IProductsResponse } from "@/modules/admin/products"

interface Props {
    token?: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
    orderBy?: 'asc' | 'desc' | null
    columnOrderBy?: 'name' | 'description' | 'createdAt' | null
}

export const getProducts = async ({ token, limit, page, search, status, columnOrderBy, orderBy }: Props={token:'sdfa'}): Promise<IProductsResponse> => {
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
        const url = '/products?' + searchParams.toString();

        const response = await valeryClient<IProductsResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const products = response.products.map((product: IProduct) => ({
            ...product,
            ...(product.lastSaleDate && { lastSaleDate: new Date(product.lastSaleDate) }),
            ...(product.launchDate && { launchDate: new Date(product.launchDate) }),
            ...(product.expirationDate && { expirationDate: new Date(product.expirationDate) }),
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt)
        }));

        return {
            products,
            meta: response.meta
        };
    } catch (error) {
        console.log(error);
        return {
            products: [],
            meta: {
                currentPage: 1,
                itemsPerPage: 0,
                totalItems: 0,
                totalPages: 1,
            }
        };
    }
}