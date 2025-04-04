"use server"
import { valeryClient } from "@/lib/api"
import { IRecipesResponse } from "@/modules/admin/production-recipes"


interface Props {
    token?: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
}

export const getRecipesResponse = async ({ token, limit, page, search, status }: Props = { token: 'sadf' }): Promise<IRecipesResponse | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);

        // Construir la URL con los parámetros de consulta
        const url = '/production/recipes?' + searchParams.toString();

        const response = await valeryClient<IRecipesResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        const recipes = response.recipes.map(recipe => ({
            ...recipe,
            createdAt: new Date(recipe.createdAt),
            updatedAt: new Date(recipe.updatedAt),
            deletedAt: recipe.deletedAt ? new Date(recipe.deletedAt) : null
        }));

        return {
            ...response,
            recipes
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}