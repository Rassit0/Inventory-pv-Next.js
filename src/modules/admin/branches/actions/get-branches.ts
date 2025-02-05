"use server"

import { valeryClient } from "@/lib/api"
import { IBranch, IBranchResponse } from "@/modules/admin/branches"

export const getBranches = async (token: string = "asdf"): Promise<IBranch[] | null> => {
    try {
        const response = await valeryClient<IBranchResponse>('/branches', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        const branches = response.branches.map((branch: IBranch) => ({
            ...branch,
            createdAt: new Date(branch.createdaAt),
            updatedAt: new Date(branch.updatedAt)
        }))

        return branches;

    } catch (error) {
        console.log(error);
        return null;
    }
}