"use server"

import { valeryClient } from "@/lib/api"
import { ICountRecipes } from "@/modules/admin/production-recipes";

interface Props {
    token: string;
    createdDate?: Date;
    createdMonth?: number;
    createdYear?: number;
    createdStartDate?: Date;
    createdEndDate?: Date;
    status?: "active" | "inactive" | "all"
}


export const getCountRecipes = async ({ token, createdDate, createdEndDate, createdMonth, createdStartDate, createdYear, status }: Props): Promise<ICountRecipes | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (createdDate) searchParams.append('createdDate', createdDate.toISOString());
        if (createdMonth) searchParams.append('createdMonth', createdMonth.toString());
        if (createdYear) searchParams.append('createdYear', createdYear.toString());
        if (createdStartDate) searchParams.append('createdStartDate', createdStartDate.toISOString());
        if (createdEndDate) searchParams.append('createdEndDate', createdEndDate.toISOString());
        if (status) searchParams.append('status', status.toString());

        // Construir la URL con los parámetros de consulta
        const url = '/dashboard/summary/countRecipes?' + searchParams.toString();
        console.log(url)
        const response = await valeryClient<ICountRecipes>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        return response;
    } catch (error) {
        console.log(error);
        return null
        // Manejar errores de la api
        // if (isApiError(error)) {
        //     return {
        //         error: true,
        //         message: error.message, // Mostrar mensaje de error específico de la API
        //     };
        // }

        // // Manejar otros errores no relacionados con la API
        // return {
        //     error: true,
        //     message: "Ha ocurrido un error desconocido"
        // }
    }
}