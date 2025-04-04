"use server"

import { valeryClient } from "@/lib/api"
import { IRole } from "@/modules/admin/user-roles";


interface Props {
    token: string;
    roleId: string
}

export const getRoleById = async ({ token, roleId }: Props): Promise<IRole | null> => {
    try {

        const response = await valeryClient<IRole>(`/auth/roles/${roleId}`, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });

        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}