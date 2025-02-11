"use server"

import { valeryClient } from "@/lib/api"
import { IWarehousesResponse } from "../interfaces/warehouse-response"


interface Props {
    token?: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
}

export const getWarehousesResponse = async ({ token, limit, page, search, status }: Props = { token: 'sadf', limit: null, page: null, search: null, status: null }): Promise<IWarehousesResponse | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);

        // Construir la URL con los parámetros de consulta
        const url = '/warehouses?' + searchParams.toString();

        const response = await valeryClient<IWarehousesResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        const warehouses = response.warehouses.map(warehouse => ({
            ...warehouse,
            createdAt: new Date(warehouse.createdAt),
            updatedAt: new Date(warehouse.updatedAt),
            deletedAt: warehouse.deletedAt ? new Date(warehouse.deletedAt) : null
        }));

        return {
            ...response,
            warehouses
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}