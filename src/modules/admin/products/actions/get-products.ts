"use server"

import { valeryClient } from "@/lib/api"
import { IProduct, IProductsResponse } from "@/modules/admin/products"

interface Props {
    token?: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
}

export const getProducts = async ({ token, limit, page, search, status }: Props = { token: 'sadf', limit: null, page: null, search: null, status: null }): Promise<IProductsResponse> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);

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