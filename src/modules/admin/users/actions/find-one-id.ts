"use server"

import { valeryClient } from "@/lib/api"
import { IProduct, IProductsResponse } from "@/modules/admin/products"
import { IUser } from "@/modules/admin/users";

interface Props {
    token: string;
    id: string;
}

export const findUser = async ({ token, id }: Props): Promise<IUser | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        // Construir la URL con los parámetros de consulta
        const url = `/auth/users/${id}`;

        const response = await valeryClient<IUser>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const user = {
            ...response,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.updatedAt)
        };

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}