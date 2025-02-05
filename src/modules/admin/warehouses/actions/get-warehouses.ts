"use server"

import { valeryClient } from "@/lib/api"
import { IWarehouse, IWarehousesResponse } from "../interfaces/warehouse-response"

export const getWarehouses = async (token: string = 'asdf'): Promise<IWarehouse[] | null> => {
    try {
        const response = await valeryClient<IWarehousesResponse>('/warehouses', {
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

        return warehouses;
    } catch (error) {
        console.log(error);
        return null;
    }
}