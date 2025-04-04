"use server"

import { valeryClient } from "@/lib/api"
import { ITransaction, IMovementsResponse } from "@/modules/admin/inventory";

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    status?: ("PENDING" | "ACCEPTED" | "CANCELED" | "COMPLETED")[] | null;
    movementType?: ("INCOME" | "OUTCOME" | "ADJUSTMENT" | "TRANSFER")[] | null;
    orderBy?: 'asc' | 'desc' | null
    columnOrderBy?: 'createdAt' | 'updatedAt' | null
}

export const getMovementsResponse = async ({ token, limit, page, status, columnOrderBy, orderBy, movementType }: Props): Promise<IMovementsResponse> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (status && status.length > 0) {
            status.forEach(s => {
                searchParams.append('status', s);
            })
        }
        if (movementType && movementType.length > 0) {
            movementType.forEach(m => {
                searchParams.append('movementType', m);
            })
        }
        if (orderBy) searchParams.append('orderBy', orderBy);
        if (columnOrderBy) searchParams.append('columnOrderBy', columnOrderBy);

        // Construir la URL con los parámetros de consulta
        const url = '/inventory/transaction?' + searchParams.toString();
        
        console.log(url)

        const response = await valeryClient<IMovementsResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const transactions = response.transactions.map((transaction: ITransaction) => ({
            ...transaction,
            ...(transaction.entryDate && { entryDate: new Date(transaction.entryDate) }),
            createdAt: new Date(transaction.createdAt),
            updatedAt: new Date(transaction.updatedAt)
        }));

        return {
            transactions,
            meta: response.meta
        };
    } catch (error) {
        console.log(error);
        return {
            transactions: [],
            meta: {
                currentPage: 1,
                itemsPerPage: 0,
                totalItems: 0,
                totalPages: 1,
            }
        };
    }
}