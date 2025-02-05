"use server"

import { valeryClient } from "@/lib/api"
import { ISupplier, ISupplierResponse } from "@/modules/admin/suppliers";

export const getSuppliers = async (token: string = 'sdf'): Promise<ISupplier[] | null> => {
    try {
        const response = await valeryClient<ISupplierResponse>('/suppliers', {
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

        return suppliers;
    } catch (error) {
        console.log(error);
        return null;
    }
}