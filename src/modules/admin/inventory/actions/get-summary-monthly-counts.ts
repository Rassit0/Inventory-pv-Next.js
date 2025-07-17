"use server"

import { valeryClient } from "@/lib/api"
import { create } from 'zustand';
import { IMonthlyOrdersCounts, IMonthlyOrderCount } from "@/modules/admin/inventory";

interface Props {
    token: string;
    createdByUserId?: string;
    originBranchId?: string;
    destinationBranchId?: string;
    originWarehouseId?: string;
    destinationWarehouseId?: string;
    month?: number;
    year?: number;
    startDate?: Date;
    endDate?: Date;
    movementType?: "INCOME" | "OUTCOME" | "TRANSFER" | "ADJUSTMENT" | "all"
    adjustmentType?: "INCOME" | "OUTCOME" | "all"
}

export const getSummaryMonthlyCounts = async ({ token, createdByUserId, originBranchId, destinationBranchId, destinationWarehouseId, originWarehouseId, endDate, month, startDate, year, movementType, adjustmentType }: Props): Promise<IMonthlyOrdersCounts | null> => {

    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (createdByUserId) searchParams.append('createdByUserId', createdByUserId);
        if (originBranchId) searchParams.append('originBranchId', originBranchId);
        if (destinationBranchId) searchParams.append('destinationBranchId', destinationBranchId);
        if (originWarehouseId) searchParams.append('originWarehouseId', originWarehouseId);
        if (destinationWarehouseId) searchParams.append('destinationWarehouseId', destinationWarehouseId);
        if (month) searchParams.append('month', month.toString());
        if (year) searchParams.append('year', year.toString());
        if (startDate) searchParams.append('startDate', startDate.toISOString());
        if (endDate) searchParams.append('endDate', endDate.toISOString());
        if (movementType) searchParams.append('movementType', movementType);
        if (adjustmentType) searchParams.append('adjustmentType', adjustmentType);

        // Construir la URL con los parámetros de consulta
        const url = '/inventory/movements/summary/monthly-counts?' + searchParams.toString();
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