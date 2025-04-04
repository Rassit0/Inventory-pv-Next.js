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
export const authVerifyToken = async (token: string): Promise<IResponse> => {

    const cookieStore = await cookies();
    try {

        const response = await valeryClient<IAuthSessionResponse>('/auth/verify', {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token
            },
        })

        const session = {
            ...response,
            user: {
                ...response.user,
                createdAt: new Date(response.user.createdAt),
                updatedAt: new Date(response.user.updatedAt)
            }
        }

        // Revalidar la ruta de sucursales
        // revalidatePath('/admin/home');
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