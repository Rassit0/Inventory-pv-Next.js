"use server"

import { valeryClient } from "@/lib/api"
import { IOrdersCount } from "@/modules/admin/production";

interface Props {
    token: string;
    originBranchId?: string;
    date?: Date;
    month?: number;
    year?: number;
    startDate?: Date;
    endDate?: Date;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "all"
}


export const getOrdersCount = async ({ token, originBranchId, date, month, year, startDate, endDate, status }: Props): Promise<IOrdersCount | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (originBranchId) searchParams.append('originBranchId', originBranchId);
        if (date) searchParams.append('date', date.toISOString());
        if (month) searchParams.append('month', month.toString());
        if (year) searchParams.append('year', year.toString());
        if (startDate) searchParams.append('startDate', startDate.toISOString());
        if (endDate) searchParams.append('endDate', endDate.toISOString());
        if (status) searchParams.append('status', status.toString());

        // Construir la URL con los parámetros de consulta
        const url = '/dashboard/summary/ordersCount?' + searchParams.toString();
        console.log(url)
        const response = await valeryClient<IOrdersCount>(url, {
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