"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}
export const createUserRole = async (formData: FormData): Promise<IResponse> => {

    const data = {
        name: formData.get('roleName'),
        description: formData.get('roleDescription'),
    }

    console.log(data)

    try {
        await valeryClient('/auth/roles', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Revalidar la ruta de sucursales
        revalidatePath('/admin/users/roles');
        return {
            error: false,
            message: "Se guardo el rol"
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