"use server"

import { isApiError, valeryClient } from "@/lib/api"
import { IMonthlyCounts } from "../../production/interfaces/mounthly-counts";
import { ISummaryCounts } from "../interfaces/summary-orders-count";

interface Props {
    token: string;
    branchId?: string;
    date?: Date;
    month?: number;
    year?: number;
    startDate?: Date;
    endDate?: Date;
}

interface IErrorResponse {
    error: boolean;
    message: string;
}

export const getSummaryCounts = async ({ token, branchId, date, month, year, startDate, endDate }: Props): Promise<ISummaryCounts | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (branchId) searchParams.append('branchId', branchId);
        if (date) searchParams.append('date', date.toISOString());
        if (month) searchParams.append('month', month.toString());
        if (year) searchParams.append('year', year.toString());
        if (startDate) searchParams.append('startDate', startDate.toISOString());
        if (endDate) searchParams.append('endDate', endDate.toISOString());

        // Construir la URL con los parámetros de consulta
        const url = '/dashboard/summary?' + searchParams.toString();
        console.log(url)
        const response = await valeryClient<ISummaryCounts>(url, {
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