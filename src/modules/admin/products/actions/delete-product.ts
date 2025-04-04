"use server"

import { isApiError, valeryClient } from "@/lib/api"
import { revalidatePath } from "next/cache";

interface Props {
    id: string;
    token: string;
}
export const deleteProduct = async ({ id, token }: Props) => {
    try {
        await valeryClient(`/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',  // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token,
            }
        });

        revalidatePath('/admin/products');

        return {
            error: null,
            message: "Se eliminó el producto"
        }
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
                response: error.response
            };
        }

        // Manejo de otros errores no ApiError si es necesario
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido'
        }
    }
}