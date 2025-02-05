"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}
export const createBranch = async (formData: FormData): Promise<IResponse> => {
    const file = formData.get("branchImage");
    let imageUrl: string | null = null;

    // Subir la imagen solo si hay un archivo
    if (file instanceof File && file.size > 0) {
        try {
            imageUrl = await uploadFile(file);
        } catch (error) {
            if (isApiError(error)) {
                return {
                    error: true,
                    message: error.message,
                    response: error.response
                };
            }

            //Manejar otro errores
            return {
                error: true,
                message: "Ha ocurrido un error desconocido"
            }
        }
    }

    const data = {
        name: formData.get('branchName'),
        location: formData.get('branchLocation'),
        phone: formData.get('branchPhone'),
        email: formData.get('branchEmail'),
        managerId: formData.get('branchManagerId'),
        latitude: Number(formData.get('branchLatitude')),
        longitude: Number(formData.get('branchLongitude')),
        imageUrl: imageUrl,
    }

    console.log(data)

    try {
        await valeryClient('/branches', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Revalidar la ruta de sucursales
        revalidatePath('/admin/branches');
        return {
            error: false,
            message: "Se guardo la sucursal"
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