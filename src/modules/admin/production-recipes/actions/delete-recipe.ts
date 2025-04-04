"use server"

import { isApiError, valeryClient } from "@/lib/api"
import { revalidatePath } from "next/cache";

interface Props {
    id: string;
    token: string;
}
export const deleteRecipe = async ({ id, token }: Props) => {
    try {
        await valeryClient(`/production/recipes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',  // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token,
            }
        });

        revalidatePath('/admin/production/recipes');

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