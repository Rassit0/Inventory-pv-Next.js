"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";


interface Props {
    formData: FormData;
    token: string;
}

export const createOrderProduction = async ({ formData, token }: Props) => {

    const orderDeliveryDate = formData.get("orderDeliveryDate")!.toString();

    // Eliminar la parte [America/La_Paz]
    const cleanedDate = orderDeliveryDate.replace(/\[.*\]$/, "");

    // Convertir a ISO 8601
    const deliveryDate = new Date(cleanedDate).toISOString();

    const data = {
        originBranchId: formData.get("orderBranchId"),
        status: formData.get("orderStatus"),
        deliveryDate,
        productionOrderDetails: formData.getAll("detailIds").map(detailId => (
            {
                recipeId: formData.get(`recipeId[${detailId}]`),
                quantity: Number(formData.get(`detailQuantity[${detailId}]`)).toFixed(2),
                parallelGroupId: formData.get(`detailparallelGroupId[${detailId}]`) || undefined,
                isParallel: formData.get(`isParallel[${detailId}]`) ? true : false,
                subTotalTime: Number(formData.get(`subTotalTime[${detailId}]`))
            }
        )),
        totalTime: Number(formData.get('orderTotalTime')),
    }

    console.log(data)

    try {
        // Realizar la solicitud para crear el producto
        await valeryClient('/production', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indicar que el cuerpo es un json
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data) // Convertir el objeto a una cadena json
        });

        // Revalidar la ruta de productos
        revalidatePath('/admin/production/orders');

        return {
            error: null,
            message: "Se guardo la orden de producción"
        }
    } catch (error) {
        // Manejar errores de la api
        if (isApiError(error)) {
            return {
                error: true,
                message: cleanErrorMessage(error.message), // Mostrar mensaje de error específico de la API
                response: {
                    ...error.response,
                    ...(error.response?.message && { message: cleanErrorMessage(error.response.message) }) // Limpiar mensaje de error
                }
            };
        }

        // Manejar otros errores no relacionados con la API
        return {
            error: true,
            message: "Ha ocurrido un error desconocido"
        }
    }
}
/**
 * Devuelve el/los mensajes sin los IDs entre corchetes.
 * Si recibe algo que no sea string ni array, lo devuelve tal cual.
 */
function cleanErrorMessage(message: any) {
    const stripIds = (msg: string) => msg.replace(/\s*\[.*?\]/g, '').trim();

    if (Array.isArray(message)) {
        return message.map(stripIds);
    }
    if (typeof message === 'string') {
        return stripIds(message);
    }
    return message; // por si acaso llega otro tipo
}