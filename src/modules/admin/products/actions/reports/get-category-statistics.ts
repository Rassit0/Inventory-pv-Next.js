"use server"

import { valeryClient } from "@/lib/api"
import { ICategoryStatistics, ICategoryStatisticsResponse } from "@/modules/admin/products"

export const getCategoryStatistics = async (token = 'sadf'): Promise<ICategoryStatisticsResponse> => {
    try {

        // Construir la URL con los parámetros de consulta
        const url = '/products/reports/category-statistics';

        const response = await valeryClient<ICategoryStatistics>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        return response;
    } catch (error) {
        console.log(error);
        return {
            reportName: '',
            statistics: []
        };
    }
}