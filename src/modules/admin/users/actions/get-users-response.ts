"use server"

import { valeryClient } from "@/lib/api";
import { IUsersResponse } from "@/modules/admin/users";
import { IUser } from '../interfaces/users-response';

interface Props {
    token?: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
}

export const getUsersResponse = async ({ token, limit, page, search, status }: Props = {}): Promise<IUsersResponse | null> => {
    try {
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);

        // Construir la URL con los parametros de consulta
        const url = '/auth/users?' + searchParams.toString();

        const response = await valeryClient<IUsersResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + (token ? token : '')
            },
        });

        // Convertir fechas a objetos data
        const users = response.users.map((user: IUser) => ({
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
        }))

        return {
            users,
            meta: response.meta
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

