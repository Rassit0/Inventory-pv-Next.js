"use server"
import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";

interface Props {
    formData: FormData;
    token: string;
    transactionId: string;
}

export const changeStatusMovement = async ({ formData, transactionId, token }: Props) => {

    // Preparar los datos para la solicitud
    const data = {
        status: formData.get("statusTransaction"),
    }

    console.log(data)

    try {
        // Realizar la solicitud para crear el producto
        await valeryClient(`/inventory/transaction/changeStatus/${transactionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data) // Convertir el objeto a una cadena JSON
        });

        // Revalidar la ruta de productos
        revalidatePath('/admin/movements');

        return {
            error: null,
            message: 'Se actualizó con éxito'
        }
    } catch (error) {
        // Manejar errores API
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
                response: error.response
            };
        }

        // Manejar errores no relacionados con la API
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido'
        }
    }
}