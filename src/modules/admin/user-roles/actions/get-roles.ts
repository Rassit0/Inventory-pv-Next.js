"use server"

import { valeryClient } from "@/lib/api"
import { IUserRole, IUserRolesResponse } from "@/modules/admin/user-roles"

export const getUserRoles = async (token: string = ''): Promise<IUserRole[] | null> => {
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