"use server"

import { valeryClient } from "@/lib/api"
import { EMovementStatus, EMovementType, IMovement, IMovementsResponse } from "@/modules/admin/inventory";

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    status?: EMovementStatus[] | null;
    movementType?: EMovementType[] | null;
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
        const url = '/inventory/movements?' + searchParams.toString();
        
        const response = await valeryClient<IMovementsResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
        });

        // COnvertir las fechas a objeros Date
        const movements = response.movements.map((movement: IMovement) => ({
            ...movement,
            ...(movement.deliveryDate && { deliveryDate: new Date(movement.deliveryDate) }),
            createdAt: new Date(movement.createdAt),
            updatedAt: new Date(movement.updatedAt)
        }));

        return {
            movements,
            meta: response.meta
        };
    } catch (error) {
        console.log(error);
        return {
            movements: [],
            meta: {
                currentPage: 1,
                itemsPerPage: 0,
                totalItems: 0,
                totalPages: 1,
            }
        };
    }
}