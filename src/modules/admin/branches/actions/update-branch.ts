"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}
export const updateBranch = async (formData: FormData, branchId: string): Promise<IResponse> => {
    const file = formData.get("branchImage");
    let imageUrl: string | null = null;

    // Subir la imagen solo si hay un archivo
    if (file instanceof File && file.size > 0) {
        try {
            imageUrl = await uploadFile(file); // Obtener la URL del archivo
            console.log("imageURL: " + imageUrl);
        } catch (error) {
            if (isApiError(error)) {
                return {
                    error: true,
                    message: error.message,
                    response: error.response
                };
            }

            return {
                error: true,
                message: 'Ha ocurrido un error desconocido'
            };
        }
    }

    // Preparar los datos para la solicitud
    const data = {
        name: formData.get('branchName'),
        location: formData.get('branchLocation'),
        phone: formData.get('branchPhone') === '' ? undefined : formData.get('branchPhone'),
        email: formData.get('branchEmail') === '' ? undefined : formData.get('branchEmail'),
        managerId: formData.get('branchManagerId'),
        latitude: formData.get('branchLatitude') === '' ? null : Number(formData.get('branchLatitude')),
        longitude: formData.get('branchLongitude') === '' ? null : Number(formData.get('branchLongitude')),
        ...(imageUrl && { imageUrl }),
    }

    console.log(data)

    try {
        // Realizar la solicitud para crear la sucursal
        await valeryClient(`/branches/${branchId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        revalidatePath('/admin/branches');

        return {
            error: false,
            message: 'Se guardo la sucursal',
        };
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
            };
        }

        return {
            error: true,
            message: 'Ha ocurrido un erro desconocido',
        };
    }
}