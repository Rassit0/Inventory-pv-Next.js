"use server"

import { isApiError, valeryClient } from "@/lib/api"
import { revalidatePath } from "next/cache";

interface Props {
    token: string;
    id: string;
}
export const deleteHandlingUnit = async ({ id, token }: Props) => {
    try {
        await valeryClient(`/units/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        });

        revalidatePath('/admin/products/handling-units')

        return {
            error: null,
            message: "Se eliminó la unidad de manejo"
        }
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message
            };
        }

        // Manejo de otros errores no ApiError
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido'
        }
    }
}