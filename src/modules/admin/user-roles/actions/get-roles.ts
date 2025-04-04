"use server"

import { valeryClient } from "@/lib/api"
import { IRole, IUserRolesResponse } from "@/modules/admin/user-roles"

interface Props {
    token: string;
}
export const getUserRoles = async ({ token }: Props): Promise<IRole[] | null> => {
    try {
        const response = await valeryClient<IUserRolesResponse>('/auth/roles', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        return response.roles;
    } catch (error) {
        console.log(error)
        return null;
    }
}