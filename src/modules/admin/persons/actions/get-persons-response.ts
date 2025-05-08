"use server"

import { valeryClient } from "@/lib/api"
import { IPersonsResponse } from "@/modules/admin/persons";

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
    orderBy?: 'asc' | 'desc' | null
    columnOrderBy?: 'name' | 'lastname' | 'secondLastname' | 'nit' | null
    signal?: AbortSignal;
    personIds?: string[];
}
export const getPersonsResponse = async ({ token, columnOrderBy, limit, orderBy, page, search, status, signal, personIds }: Props): Promise<IPersonsResponse | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);
        if (orderBy) searchParams.append('orderBy', orderBy);
        if (columnOrderBy) searchParams.append('columnOrderBy', columnOrderBy);

        // Si productIds se proporciona, se agrega a la URL usando un forEach
        if (personIds && personIds.length > 0) {
            personIds.forEach((id) => {
                searchParams.append('personIds', id); // Agrega cada id de productIds como un parámetro individual
            });
        }

        // Construir la URL con los parámetros de consulta
        const url = '/persons?' + searchParams.toString();

        const response = await valeryClient<IPersonsResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            signal
        });

        const persons = response.persons.map(person => ({
            ...person,
            createdAt: new Date(person.createdAt),
            updatedAt: new Date(person.updatedAt),
            ...(person.deletedAt && { deletedAt: new Date(person.deletedAt) }),
        }));

        return {
            ...response,
            persons
        };
    } catch (error: any) {
        if (error.name === "AbortError") {
            // eslint-disable-next-line no-console
            console.log("Fetch aborted");
        } else {
            console.log(error);
        }
        return null;
    }
}