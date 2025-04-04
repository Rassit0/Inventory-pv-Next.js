"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}

interface Props {
    token: string;
    id: string;
}

export const deleteBranch = async ({ id, token }: Props): Promise<IResponse> => {
    try {
        await valeryClient(`/branches/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        });

        revalidatePath('/admin/branches');

        return {
            error: false,
            message: "Se eliminó la sucursal"
        };
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
                response: error.response
            };
        }

        return {
            error: true,
            message: 'Ha ocurrido un error desconocido'
        };
    }
}