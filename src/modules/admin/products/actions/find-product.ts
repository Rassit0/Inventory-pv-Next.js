"use server"

import { valeryClient } from "@/lib/api"
import { IProduct, IProductsResponse } from "@/modules/admin/products"

interface Props {
    token: string;
    term: string;
}

export const findProduct = async ({ token, term }: Props): Promise<IProduct | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        // Construir la URL con los parámetros de consulta
        const url = `/products/${term}`;

        const response = await valeryClient<IProduct>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const product = {
            ...response,
            ...(response.launchDate && { launchDate: new Date(response.launchDate) }),
            ...(response.expirationDate && { expirationDate: new Date(response.expirationDate) }),
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.updatedAt)
        };

        return product;
    } catch (error) {
        console.log(error);
        return null;
    }
}