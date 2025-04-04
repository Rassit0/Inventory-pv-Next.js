"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface Props {
    id: string;
    token: string;
}

export const deleteCategory = async ({ id, token }: Props) => {
    try {
        await valeryClient(`/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',  // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token
            }
        });

        revalidatePath('/admin/products/categories');

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