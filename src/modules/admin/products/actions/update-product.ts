"use server"
import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";

export const updateProduct = async (formData: FormData, productId: string) => {
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
        type: formData.get("productType"),
        price: Number(formData.get("productPrice")).toFixed(2),
        stock: Number(0).toFixed(2),
        unitId: formData.get("productUnitId"),
        ...(imageUrl && { imageUrl }), // Solo agrega si `imageUrl` tiene valor
        lastSaleDate: null,
        launchDate: formData.get("productLaunchDate") ? new Date(formData.get("productLaunchDate")!.toString()).toISOString() : null,
        expirationDate: formData.get("productExpirationDate") ? new Date(formData.get("productExpirationDate")!.toString()).toISOString() : null,
        isEnable: true,
        purchasePrice: Number(formData.get("productPurchasePrice")).toFixed(2),
        minimumStock: Number(formData.get("productMinimunStock")).toFixed(2),
        reorderPoint: Number(formData.get("productReorderPoint")).toFixed(2),
        stockLocation: null,
        seasonId: formData.get("productSeasonId"),
        categories: formData.getAll("categoryIds").map(categoryId => (
            { id: categoryId }
        )),
        composedByProducts: formData.getAll("componentIds").map(componentId => (
            {
                composedProductId: componentId,
                quantity: Number(formData.get(`quantities[${componentId}]`)).toFixed(2)
            }
        )),
    }

    console.log(data)

    try {
        // Realizar la solicitud para crear el producto
        await valeryClient(`/products/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Indicar que el cuerpo es un JSON
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