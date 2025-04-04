"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}

interface Props {
    id: string;
    token: string;
}

export const deleteSupplier = async ({ id, token }: Props): Promise<IResponse> => {
    try {
        await valeryClient(`/suppliers/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            }
        });

        revalidatePath('/admin/suppliers');

        return {
            error: false,
            message: 'Se eliminó el proveedor',
        }
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
                response: error.response
            }
        }

        // Manejo de otros errores no ApiError si es necesario
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido.'
        }
    }
}