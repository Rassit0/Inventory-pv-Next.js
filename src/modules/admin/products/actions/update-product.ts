"use server"
import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";

interface Props {
    formData: FormData;
    token: string;
    productId: string;
}

export const updateProduct = async ({ formData, productId, token }: Props) => {

    console.log(formData.get("productLaunchDate"))
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

    // Preparar los datos para la solicitud
    const data = {
        name: formData.get("productName"),
        description: formData.get("productDescription"),
        typesProduct: formData.getAll("productType"),
        // price: Number(formData.get("productPrice")).toFixed(2),
        unitId: formData.get("productUnitId"),
        ...(imageUrl && { imageUrl }),
        // lastSaleDate: null,
        minimumStock: Number(formData.get('minimumStockProduct')).toFixed(2),
        reorderPoint: Number(formData.get('reorderPointProduct')).toFixed(2),
        // launchDate: formData.get("productLaunchDate") ? new Date(formData.get("productLaunchDate")!.toString().replace(/\[.*?\]/, '')).toISOString() : null,
        // expirationDate: formData.get("productExpirationDate") ? new Date(formData.get("productExpirationDate")!.toString().replace(/\[.*?\]/, '')).toISOString() : null,
        isEnable: formData.get('productIsEnable') === 'true',
        categories: formData.getAll("categoryIds").map(categoryId => (
            { id: categoryId }
        )),
        suppliers: formData.getAll("productSuppliers").map(supplierId => (
            { supplierId: supplierId }
        )),
        // branchProductInventory: formData.getAll("branchesIds").map(branchId => ({
        //     branchId: branchId,
        //     stock: Number(formData.get(`inventoryStock[${branchId}]`)).toFixed(2),
        //     minimumStock: Number(formData.get(`inventoryMinimumStock[${branchId}]`)).toFixed(2),
        //     reorderPoint: Number(formData.get(`inventoryReorderPoint[${branchId}]`)).toFixed(2),
        //     warehouseId: formData.get(`inventoryWarehouseId[${branchId}]`),
        //     purchasePriceOverride: formData.get(`inventoryPurchasePriceOverride[${branchId}]`) ?
        //         Number(formData.get(`inventoryPurchasePriceOverride[${branchId}]`)).toFixed(2)
        //         : undefined,
        //     priceOverride: formData.get(`inventoryPriceOverride[${branchId}]`) ?
        //         Number(formData.get(`inventoryPriceOverride[${branchId}]`)).toFixed(2)
        //         : undefined,
        //     lastStockUpdate: "2025-01-20T12:00:00.000Z",
        // })),
    }

    console.log(data)

    try {
        // Realizar la solicitud para crear el producto
        await valeryClient(`/products/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data) // Convertir el objeto a una cadena JSON
        });

        // Revalidar la ruta de productos
        revalidatePath('/admin/products');

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