"use server"

import { valeryClient } from "@/lib/api"
import { IParallelGroup, IProduction, IProductionsResponse, IResponseParallelGroups } from "@/modules/admin/production";
import { group } from "console";

interface Props {
    token: string;
    // searchBranchId?: string;
    // searchWarehouseId?: string;
}

export const getParallelGroups = async ({ token }: Props): Promise<IParallelGroup[]> => {
    try {

        // Construir la URL con los parámetros de consulta
        const url = '/production/find-all-parallel-groups';

        const response = await valeryClient<IResponseParallelGroups>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const groups = response.parallelGroups.map((group: IParallelGroup) => ({
            ...group,
            // ...(group.lastSaleDate && { lastSaleDate: new Date(group.lastSaleDate) }),
            // ...(group.launchDate && { launchDate: new Date(group.launchDate) }),
            // ...(group.expirationDate && { expirationDate: new Date(group.expirationDate) }),
            createdAt: new Date(group.createdAt),
            updatedAt: new Date(group.updatedAt)
        }));

        return groups;
    } catch (error) {
        console.log(error);
        return [];
    }
}