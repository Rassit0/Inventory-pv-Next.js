"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const deleteCategory = async (id: string) => {
    try {
        await valeryClient(`/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',  // Indicar que el cuerpo es un JSON
            }
        });

        revalidatePath('/admin/categories');

        return {
            error: null,
            message: "Se eliminó la categoría"
        }
    } catch (error) {
        // console.log(error);

        if (isApiError(error)) {
            return {
                error: true,
                message: error.message // Esto ahora debería funcionar sin errores de tipo
            };
        }

        // Manejo de otros errores no ApiError si es necesario
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido'
        };
    }
}