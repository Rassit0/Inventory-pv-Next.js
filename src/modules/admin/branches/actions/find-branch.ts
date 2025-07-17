"use server"

import { valeryClient } from "@/lib/api"
import { IBranch } from "@/modules/admin/branches";

interface Props {
    token: string;
    id: string;
}

export const findBranch = async ({ token, id }: Props): Promise<IBranch | null> => {
    try {

        // Construir la URL con los parámetros de consulta
        const url = `/branches/${id}`;

        const response = await valeryClient<IBranch>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const branch = {
            ...response,
            warehouses: response.warehouses.map(warehouse => ({
                ...warehouse,
                createdAt: new Date(warehouse.createdAt),
                updatedAt: new Date(warehouse.updatedAt)
            })),
            createdAt: new Date(response.createdaAt),
            updatedAt: new Date(response.updatedAt)
        };

        return branch;
    } catch (error) {
        console.log(error);
        return null;
    }
}