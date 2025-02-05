"use server"

import { valeryClient } from "@/lib/api"
import { IHighDemand, IHighDemandProduct } from "@/modules/admin/products"

export const getHighDemand = async (token = 'sadf'): Promise<IHighDemand> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        // Construir la URL con los parámetros de consulta
        const url = '/products/reports/high-demand';

        const response = await valeryClient<IHighDemand>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        //Convertir las fechas a objeros Date
        const result = {
            ...response,
            products: response.products.map((product: IHighDemandProduct) => ({
                ...product,
                lastSaleDate: new Date(product.lastSaleDate),
            })),
        }

        return result;
    } catch (error) {
        console.log(error);
        return {
            reportName: '',
            products: []
        };
    }
}