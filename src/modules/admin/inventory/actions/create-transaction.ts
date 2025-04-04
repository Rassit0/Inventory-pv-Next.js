"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
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
export const createTransaction = async ({ token, formData }: Props): Promise<IResponse> => {

    const data = {
        movementType: formData.get('movementTypeTransaction'),
        adjustmentType: formData.get('adjustmentTypeTransaction'),
        entryDate: formData.get('entryDateTransaction')? new Date(formData.get('entryDateTransaction') as string).toISOString():undefined,
        inventoryTransactionProducts: formData.getAll('productIds').map(productId => {
            const inventoryStock = {
                originBranchId: formData.get('branchOriginIdTransaction') || undefined,
                originWarehouseId: formData.get('warehouseOriginIdTransaction') || undefined,
                branchId: formData.get('branchDestinyIdTransaction') || undefined,
                warehouseId: formData.get('warehouseDestinyIdTransaction') || undefined,
                quantity: Number(formData.get(`product-quantity[${productId}]`)).toFixed(2),
            }
            return {
                productId,
                unit: formData.get(`unitNameProduct[${productId}]`),
                ...(() => {
                    if (!formData.get('warehouseDestinyIdTransaction')) {
                        if (formData.get('branchDestinyIdTransaction')) {
                            return { branchStock: inventoryStock }
                        }
                        if (formData.get('warehouseOriginIdTransaction')) {
                            return { warehouseStock: inventoryStock }
                        }
                        return { branchStock: inventoryStock }
                    } else {
                        if (!formData.get('branchDestinyIdTransaction')) {
                            if (formData.get('branchDestinyIdTransaction')) {
                                return { branchStock: inventoryStock }
                            }
                            if (formData.get('warehouseOriginIdTransaction')) {
                                return { warehouseStock: inventoryStock }
                            }
                            return { warehouseStock: inventoryStock }
                        }
                    }
                })()
            }
        }),
    }

    console.log(data.inventoryTransactionProducts)
    try {

        await valeryClient('/inventory/transaction', {
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
            message: "Se registró la transacción."
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