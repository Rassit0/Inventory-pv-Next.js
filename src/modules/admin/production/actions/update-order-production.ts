"use server"
import { isApiError, valeryClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface Props {
    formData: FormData;
    token: string;
    orderId: string;
}

export const updateOrderProduction = async ({ formData, orderId, token }: Props) => {

    const orderDeliveryDate = formData.get("orderDeliveryDate") ? formData.get("orderDeliveryDate")!.toString() : null;

    // Eliminar la parte [America/La_Paz]
    const cleanedDate = orderDeliveryDate ? orderDeliveryDate.replace(/\[.*\]$/, "") : null;

    // Convertir a ISO 8601
    const deliveryDate = cleanedDate ? new Date(cleanedDate).toISOString() : null;

    // Preparar los datos para la solicitud
    const data = {
        branchId: formData.get("orderBranchId") || undefined,
        status: formData.get("orderStatus") || undefined,
        deliveryDate: deliveryDate || undefined,
        productionOrderDetails: formData.getAll("detailIds") && formData.getAll("detailIds").length > 0 ? formData.getAll("detailIds").map(detailId => (
            {
                recipeId: formData.get(`recipeId[${detailId}]`),
                quantity: Number(formData.get(`detailQuantity[${detailId}]`)).toFixed(2),
                parallelGroupId: formData.get(`detailparallelGroupId[${detailId}]`) || undefined,
                isParallel: formData.get(`isParallel[${detailId}]`) ? true : false,
                subTotalTime: Number(formData.get(`subTotalTime[${detailId}]`))
            }
        )) : undefined,
        totalTime: formData.get('orderTotalTime') ? Number(formData.get('orderTotalTime')) : undefined,
        productionWaste: formData.getAll('productIds') && formData.getAll('productIds').length > 0 ? formData.getAll('productIds').map(productId => (
            {
                productId: productId,
                quantity: Number(formData.get(`wasteQuantity-${productId}`)).toFixed(2),
                reason: formData.get(`wasteReason-${productId}`) ?? undefined,
                reasonDescription: formData.get(`reasonDescription-${productId}`) ?? undefined
            }

        )) : undefined
    }

    console.log(data)

    try {
        // Realizar la solicitud para crear el producto
        await valeryClient(`/production/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data) // Convertir el objeto a una cadena JSON
        });

        // Revalidar la ruta de productos
        revalidatePath('/admin/production/orders');

        return {
            error: null,
            message: 'Se actualizó la orden de producción con éxito'
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