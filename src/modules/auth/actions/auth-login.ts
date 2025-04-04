"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";
import { IAuthSessionResponse } from "@/modules/auth";
import { cookies } from "next/headers";

interface IResponse {
    error: boolean;
    message: any;
    session?: IAuthSessionResponse;
    response?: any;
}
export const authLogin = async (formData: FormData): Promise<IResponse> => {

    const cookieStore = await cookies();

    const data = {
        email: formData.get('authEmail'),
        password: formData.get('authPassword'),
    }

    console.log(data)
    try {

        const response = await valeryClient<IAuthSessionResponse>('/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const session = {
            ...response,
            user: {
                ...response.user,
                createdAt: new Date(response.user.createdAt),
                updatedAt: new Date(response.user.updatedAt)
            }
        }

        // 🔹 Guardar token en cookies HTTP-only
        cookieStore.set("auth_token", response.token, {
            httpOnly: true,// Protege contra accesos desde JavaScript
            secure: process.env.NODE_ENV === "production", // Solo en producción
            maxAge: 60 * 60 * 24, // 1 día
            path: "/",
        });

        // Revalidar la ruta de sucursales
        revalidatePath('/admin/home');
        return {
            error: false,
            message: "Se inició sesión",
            session
        }
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message
            };
        }

        return {
            error: true,
            message: "Ha ocurrido un error desconocido"
        };
    }
}