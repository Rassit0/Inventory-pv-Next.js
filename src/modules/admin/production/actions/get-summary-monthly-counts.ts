"use server"

import { valeryClient } from "@/lib/api"
import { IProductionOrder, IProductionsResponse, IProductionWaste } from "@/modules/admin/production";
import { create } from 'zustand';
import { IMonthlyOrdersCounts, IMonthlyOrderCount } from "@/modules/admin/production";

interface Props {
    token: string;
    createdByUserId?: string;
    originBranchId?: string;
    month?: number;
    year?: number;
    startDate?: Date;
    endDate?: Date;
}

export const getSummaryMonthlyCounts = async ({ token, createdByUserId, originBranchId, endDate, month, startDate, year }: Props): Promise<IMonthlyOrdersCounts | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (createdByUserId) searchParams.append('createdByUserId', createdByUserId);
        if (originBranchId) searchParams.append('originBranchId', originBranchId);
        if (month) searchParams.append('month', month.toString());
        if (year) searchParams.append('year', year.toString());
        if (startDate) searchParams.append('startDate', startDate.toISOString());
        if (endDate) searchParams.append('endDate', endDate.toISOString());

        // Construir la URL con los parámetros de consulta
        const url = '/production/summary/monthly-counts?' + searchParams.toString();
        console.log(url)
        const response = await valeryClient<IMonthlyOrdersCounts>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}