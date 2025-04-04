"use server"

import { isApiError } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface IResponse {
    error: boolean;
    message: string;
    response?: any;
}

export const authLogout = async (): Promise<IResponse> => {
    try {
        const cookieStore = await cookies();

        // 🔹 Eliminar token de autenticación
        cookieStore.delete("auth_token");

        // Revalidar la ruta de administración
        revalidatePath('/admin/home');

        return {
            error: false,
            message: "Sesión cerrada correctamente",
        };
    } catch (error) {
        // Manejar errores de la api
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message, // Mostrar mensafe de error específico de la API
                response: error.response
            };
        }

        return {
            error: true,
            message: "Error al cerrar sesión",
        };
    }
};
