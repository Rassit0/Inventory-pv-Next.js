"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { parseZonedDateTime } from "@internationalized/date";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}

interface Props {
    token: string;
    formData: FormData
}
export const createMovement = async ({ token, formData }: Props): Promise<any> => {

    const movementAdjustmentType = formData.get('movementAdjustmentType');
    const adjustmentReason = formData.get('adjustmentReason') || undefined;
    const otherAdjustmentReason = formData.get('otherAdjustmentReason') || undefined;

    const rawDate = formData.get('movementGeneralDeliveryDate') as string; // puede ser null o ""

    const generalDeliveryDate = parseZonedDateTime(rawDate).toAbsoluteString();     // «2025‑07‑03T12:41:28.027‑04:00»;

    const data = {
        movementType: formData.get('movementType'),
        adjustment: adjustmentReason && movementAdjustmentType ? {
            adjustmentType: movementAdjustmentType,
            adjustmentReason: adjustmentReason,
            ...(adjustmentReason === 'OTHER' && otherAdjustmentReason ? { otherAdjustmentReason } : undefined)
        } : undefined,
        // adjustmentType: formData.get('movementAdjustmentType')|| undefined,
        // adjustmentReason: 'DAMAGE',
        generalDeliveryDate,
        originBranchId: formData.get('movementBranchOriginId') || undefined,
        originWarehouseId: formData.get('movementWarehouseOriginId') || undefined,
        destinationBranchId: formData.get('movementDestinationBranchId') || undefined,
        destinationWarehouseId: formData.get('movementDestinationWarehouseId') || undefined,
        description: formData.get('movementDescription') || undefined,
        // deliveryManagers: formData.getAll("selectPerson").map(categoryId => (
        //     { id: categoryId }
        // )),
        inventoryMovementDetails: formData.getAll('productIds').map(productId => {
            // const inventoryStock = {
            //     originBranchId: formData.get('branchOriginIdTransaction') || undefined,
            //     originWarehouseId: formData.get('warehouseOriginIdTransaction') || undefined,
            //     branchId: formData.get('branchDestinyIdTransaction') || undefined,
            //     warehouseId: formData.get('warehouseDestinyIdTransaction') || undefined,
            //     quantity: Number(formData.get(`product-quantity[${productId}]`)).toFixed(2),
            // }
            const quantity = Number(formData.get(`product-quantity[${productId}]`)).toFixed(2)
            return {
                productId,
                unit: formData.get(`unitNameProduct[${productId}]`),
                totalExpectedQuantity: quantity
                // ...(() => {
                //     if (!formData.get('warehouseDestinyIdTransaction')) {
                //         if (formData.get('branchDestinyIdTransaction')) {
                //             return { branchStock: inventoryStock }
                //         }
                //         if (formData.get('warehouseOriginIdTransaction')) {
                //             return { warehouseStock: inventoryStock }
                //         }
                //         return { branchStock: inventoryStock }
                //     } else {
                //         if (!formData.get('branchDestinyIdTransaction')) {
                //             if (formData.get('branchDestinyIdTransaction')) {
                //                 return { branchStock: inventoryStock }
                //             }
                //             if (formData.get('warehouseOriginIdTransaction')) {
                //                 return { warehouseStock: inventoryStock }
                //             }
                //             return { warehouseStock: inventoryStock }
                //         }
                //     }
                // })()
            }
        }),
    }

    console.log(data)
    try {

        await valeryClient('/inventory/movements', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data),
        })

        // Revalidar la ruta de sucursales
        revalidatePath('/admin/movements');
        return {
            error: false,
            message: "Se registró del movimiento de inventario."
        }
    } catch (error) {
        console.log(error)
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
                response: error.response
            };
        }

        return {
            error: true,
            message: "Ha ocurrido un error desconocido"
        };
    }
}