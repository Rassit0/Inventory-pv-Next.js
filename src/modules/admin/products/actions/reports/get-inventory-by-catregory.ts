"use server"

import { valeryClient } from "@/lib/api"
import { IInventoryByCategory, IInventoryByCategoryProduct } from "@/modules/admin/products"
import { InventoryByCategory } from "../../interfaces/reports/inventory-by-category-response";

export const getInventoryByCategory = async (token = 'sadf'): Promise<IInventoryByCategory> => {
    try {
        // Construir la URL con los parámetros de consulta
        const url = '/products/reports/inventory-by-category';

        const response = await valeryClient<IInventoryByCategory>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        //Convertir las fechas a objeros Date
        const result = {
            ...response,
            products: response.inventoryByCategory.map((category: InventoryByCategory) => ({
                ...category,
                createdAt: new Date(category.createdAt),
                updatedAt: new Date(category.updatedAt),
            })),
        }

        return result;
    } catch (error) {
        console.log(error);
        return {
            reportName: '',
            inventoryByCategory: []
        };
    }
}