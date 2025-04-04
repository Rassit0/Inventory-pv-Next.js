"use server"

import { valeryClient } from "@/lib/api"
import { IRecipe } from "@/modules/admin/production-recipes";

interface Props {
    token: string;
    term: string;
}

export const findRecipe = async ({ token, term }: Props): Promise<IRecipe | null> => {
    try {

        // Construir la URL con los parámetros de consulta
        const url = `/production/recipes/${term}`;

        const response = await valeryClient<IRecipe>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const recipe = {
            ...response,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.updatedAt),
            deletedAt: response.deletedAt ? new Date(response.updatedAt) : null,
        };

        return recipe;
    } catch (error) {
        console.log(error);
        return null;
    }
}