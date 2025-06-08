"use server"

import { isApiError, valeryClient } from "@/lib/api"
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}

interface Props {
    token: string;
    id: number;
}

export const deleteContact = async ({ id, token }: Props): Promise<IResponse> => {
    try {
        await valeryClient(`/suppliers/remove-contact/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            }
        });

        revalidatePath('/admin/suppliers');
        return {
            error: false,
            message: "Se eliminó el contacto"
        }
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
                response: error.message
            }
        }

        // Manejo de otros eerrores
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido'
        }
    }
}