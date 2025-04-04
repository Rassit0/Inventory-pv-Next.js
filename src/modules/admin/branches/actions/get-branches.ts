"use server"

import { valeryClient } from "@/lib/api"
import { IBranch, IBranchesResponse } from "@/modules/admin/branches"

interface Props {
    token: string;
    page?: number | null;
    limit?: number | null;
    search?: string | null;
}

export const getBranches = async ({ token, limit, page, search }: Props): Promise<IBranchesResponse | null> => {
    try {
        // Construir dinámicamente los parámetros de consulta
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page.toString());
        if (limit) searchParams.append('limit', limit.toString());
        if (search) searchParams.append('search', search);

        // Construir la URL con los parámetros de consulta
        const url = '/branches?' + searchParams.toString();

        const response = await valeryClient<IBranchesResponse>(url, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
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