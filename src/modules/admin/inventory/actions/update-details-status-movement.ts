"use server"
import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { form } from "@heroui/react";
import { parseZonedDateTime } from "@internationalized/date";
import { revalidatePath } from "next/cache";

interface Props {
    formData: FormData;
    token: string;
    transactionId: string;
}

export const updateDetailsAndStatusMovement = async ({ formData, transactionId, token }: Props) => {

    // Preparar los datos para la solicitud
    const data = {
        status: formData.get("statusTransaction"),
        inventoryMovementDetails: formData.getAll("detailIds").map((detailId: any) => {
            return {
                id: detailId,
                productId: formData.get(`productId-${detailId}`) ?? undefined,
                totalDeliveredQuantity: (() => {
                    const value = formData.get(`totalDeliveredQuantity-${detailId}`);
                    if (value === '' || value === null || value === undefined) return undefined;
                    const num = Number(value);
                    if (isNaN(num)) return undefined;
                    return num.toFixed(2);
                })(),
                detailSuppliers: formData.getAll(`detailSuppliersIndex-${detailId}`).length > 0
                    ? formData.getAll(`detailSuppliersIndex-${detailId}`).map((dsIndex) => { // Obtener los IDs de los proveedores del detalle
                        return {
                            id: formData.get(`detailSupplierId-${detailId}-${dsIndex}`) === '' ? undefined : formData.get(`detailSupplierId-${detailId}-${dsIndex}`) ?? undefined,
                            deliveredQuantity: (() => {
                                const value = formData.get(`deliveredQuantity-${detailId}-${dsIndex}`);
                                if (value === '' || value === null || value === undefined) return undefined;
                                const num = Number(value);
                                if (isNaN(num)) return undefined;
                                return num.toFixed(2);
                            })(),
                            supplierId: formData.get(`supplierId-${detailId}-${dsIndex}`) === '' ? undefined : formData.get(`supplierId-${detailId}-${dsIndex}`) ?? undefined,
                            deliveryDate: (() => {
                                const value = formData.get(`supplierDeliveryDate-${detailId}-${dsIndex}`);
                                if(value === '' || value === null || value === undefined) return null;
                                else {
                                    const zonedDate = parseZonedDateTime(value as string);
                                    if (zonedDate) {
                                        return zonedDate.toAbsoluteString();
                                    }
                                }
                            })(),
                        };
                    })
                    : undefined,
            };
        }),
    }

    if (data.status === 'COMPLETED') {
        for (const detail of data.inventoryMovementDetails) {
            if ((detail.detailSuppliers === undefined || detail.detailSuppliers.length === 0) && detail.totalDeliveredQuantity === undefined) {
                return {
                    error: true,
                    message: "Debe agregar al menos una cantidad-proveedor por detalle cuando el estado es Completado"
                };
            }
        }
    }

    console.log(data.inventoryMovementDetails?.[0].detailSuppliers?.[0].deliveryDate || null)

    // const error: any = {};
    // return {
    //     error: true,
    //     message: 'Ha ocurrido un error desconocido',
    //     response: error.response
    // };
    try {
        // Realizar la solicitud para crear el producto
        await valeryClient(`/inventory/movements/updateDetailsAndStatus/${transactionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data) // Convertir el objeto a una cadena JSON
        });

        // Revalidar la ruta de productos
        revalidatePath('/admin/inventory/movements');

        return {
            error: null,
            message: 'Se actualizó con éxito'
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