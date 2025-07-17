"use server"

import { valeryClient } from "@/lib/api"
import { IProductionOrder, IProductionsResponse, IProductionWaste } from "@/modules/admin/production";

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
    originBranchId?: string;
    orderBy?: 'asc' | 'desc' | null
    columnOrderBy?: 'updatedAt' | 'deliveryDate' | 'createdAt' | null
    date?: Date;
    // searchBranchId?: string;
    // searchWarehouseId?: string;
}

export const getProductions = async ({ token, limit, page, search, status, originBranchId, columnOrderBy, orderBy, date }: Props): Promise<IProductionsResponse> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);
        if (orderBy) searchParams.append('orderBy', orderBy);
        if (columnOrderBy) searchParams.append('columnOrderBy', columnOrderBy);
        if (originBranchId) searchParams.append('originBranchId', originBranchId);
        // if (date) searchParams.append('date', date.toISOString());
        // if (date) date.setHours(0, 0, 0, 0);
        // if (searchWarehouseId) searchParams.append('warehouseId', searchWarehouseId);

        console.log('date orders filter:', date?.toISOString())

        // Construir la URL con los parámetros de consulta
        const url = '/production?' + searchParams.toString() + (searchParams.toString() === '' ? '' : date ? '&deliveryDate=' + date.toISOString() : '');
        console.log(url)
        const response = await valeryClient<IProductionsResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const orders = response.orders.map((order: IProductionOrder) => ({
            ...order,
            // ...(order.lastSaleDate && { lastSaleDate: new Date(order.lastSaleDate) }),
            // ...(order.launchDate && { launchDate: new Date(order.launchDate) }),
            // ...(order.expirationDate && { expirationDate: new Date(order.expirationDate) }),
            deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : null,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            productionWaste: order.productionWaste.map((waste: IProductionWaste) => ({
                ...waste,
                createdAt: new Date(waste.createdAt),
            }))
        }));

        return {
            orders,
            meta: response.meta
        };
    } catch (error) {
        console.log(error);
        return {
            orders: [],
            meta: {
                currentPage: 1,
                itemsPerPage: 0,
                totalItems: 0,
                totalPages: 1,
            }
        };
    }
}