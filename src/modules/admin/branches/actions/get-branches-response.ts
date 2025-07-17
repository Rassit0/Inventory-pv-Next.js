"use server"

import { valeryClient } from "@/lib/api"
import { IBranch, IBranchesResponse } from "@/modules/admin/branches"

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
    status?: string | null;
    orderBy?: 'asc' | 'desc' | null;
    columnOrderBy?: 'name' | 'address' | 'createdAt' | null;
    branchesIds?: string[];
    signal?: AbortSignal;
}

export const getBranchesResponse = async ({ token, limit, page, search, status, orderBy, columnOrderBy, branchesIds, signal }: Props): Promise<IBranchesResponse | null> => {
    try {

        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();


        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);
        if (status) searchParams.append('status', status);
        if (orderBy) searchParams.append('orderBy', orderBy);
        if (columnOrderBy) searchParams.append('columnOrderBy', columnOrderBy);

        // Si branchesIds se proporciona, se agrega a la URL usando un forEach
        let data = null;
        if (branchesIds && branchesIds.length > 0) {
            data = {
                branchesIds
            }
        }

        // Construir la URL con los parámetros de consulta
        const url = `/branches${data ? '/by-ids' : ''}?` + searchParams.toString();

        const response = await valeryClient<IBranchesResponse>(url, {
            method: data ? 'POST' : 'GET',
            headers: {
                ...(data && { 'Content-Type': 'application/json', }),
                Authorization: 'Bearer ' + token,
            },
            signal,
            body: data ? JSON.stringify(data) : undefined,
        });

        const branches = response.branches.map((branch: IBranch) => ({
            ...branch,
            createdAt: new Date(branch.createdaAt),
            updatedAt: new Date(branch.updatedAt)
        }))

        return {
            ...response,
            branches
        };

    } catch (error) {
        console.log(error);
        return null;
    }
}