"use server"

import { isApiError, valeryClient } from "@/lib/api"
import { revalidatePath } from "next/cache";

export const deleteProduct = async (id: string) => {
    try {
        await valeryClient(`/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',  // Indicar que el cuerpo es un JSON
            }
        });

        revalidatePath('/admin/products');

        return {
            error: null,
            message: "Se eliminó el producto"
        }
    } catch (error) {
        if(isApiError(error)){
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