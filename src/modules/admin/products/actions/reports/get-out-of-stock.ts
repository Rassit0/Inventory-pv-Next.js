"use server"

import { valeryClient } from "@/lib/api"
import { IOutOfStock, IProductsResponse, ISimpleProduct } from "@/modules/admin/products"

export const getOutOfStock = async (token='sadf'): Promise<IOutOfStock> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        // Construir la URL con los parámetros de consulta
        const url = '/products/reports/out-of-stock';

        const response = await valeryClient<IOutOfStock>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        // const products = response.products.map((product: IOutOfStock) => ({
        //     ...product,
        //     createdAt: new Date(product.createdAt),
        //     updatedAt: new Date(product.updatedAt)
        // }));

        return response;
    } catch (error) {
        console.log(error);
        return {
            reportName: '',
            products: []
        };
    }
}