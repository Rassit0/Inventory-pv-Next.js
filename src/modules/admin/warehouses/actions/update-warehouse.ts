"use server"
import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}

export const updateWarehouse = async (formData: FormData, warehouseId: string): Promise<IResponse> => {
    const file = formData.get("productImage");
    let imageUrl: string | null = null;

    // Subir la imagen solo si hay un archivo
    if (file instanceof File && file.size > 0) {
        try {
            imageUrl = await uploadFile(file); // Obtener la URL del archivo subido
            console.log("imageUrl: " + imageUrl);
        } catch (error) {
            // Si ocurre un error al subir la imagen, lanzarlo para manejar más adelante
            if (isApiError(error)) {
                return {
                    error: true,
                    message: error.message,
                    response: error.response
                };
            }

            // Manejar otros errores no relacionados con la API
            return {
                error: true,
                message: 'Ha ocurrido un error desconocido'
            }
        }
    }

    const data = {
        name: formData.get('warehouseName'),
        location: formData.get('warehouseLocation'),
        isEnable: formData.get('warehouseIsEnable') === 'true',
        branches: formData.getAll('warehouseBranchIds').map(branchId => ({
            branchId: branchId
        })),
        usersAccess: formData.getAll('userAccessIds').map(userId => ({
            userId: userId,
            role: formData.get(`userAccess[${userId}]`)
        })),
        ...(imageUrl && { imageUrl }),
    }
    console.log(data)
    try {
        await valeryClient(`/warehouses/${warehouseId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Revalidar la ruta de almacenes
        revalidatePath('/admin/warehouses');

        return {
            error: false,
            message: 'Se actualizó con éxito.'
        }
    } catch (error) {
        // Manejar errores API
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message
            };
        }

        // Manejar errores no relacionados con la API
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido'
        }
    }
}