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
export const createRecipe = async ({ token, formData }: Props): Promise<IResponse> => {
    const file = formData.get("recipeImage")
    let imageUrl: string | null = null;

    // SUBIR LA IMAGEN SOLO SI HAY UN ARCHIVO
    if (file instanceof File && file.size > 0) {
        try {
            imageUrl = await uploadFile(file); // Obtener la URL del archivo subido
            console.log("imageURL: " + imageUrl);
        } catch (error) {
            // Si ocurre un error al subir la imagen, lanzarlo para manejar más adelante
            if (isApiError(error)) {
                return {
                    error: true,
                    message: error.message,
                    response: error.response
                };
            }

            //Manejar otros errores
            return {
                error: true,
                message: "No se pudo subir la imagen. Ha ocurrido un error desconocido"
            };
        }
    }
    const data = {
        name: formData.get('recipeName'),
        description: formData.get('recipeDescription'),
        preparationInstructions: formData.get('recipePreparationInstructions'),
        preparationTime: Number(formData.get('recipePreparationTime')),
        imageUrl: imageUrl,
        isEnable: formData.get('recipeIsEnable') === 'true',
        items: formData.getAll('productIds').map(productId => {
            return {
                productId,
                quantity: Number(formData.get(`product-quantity[${productId}]`)).toFixed(2),
            }
        }),
    }

    // console.log(data.inventoryTransactionProducts)
    try {

        await valeryClient('/production/recipes', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data),
        })

        // Revalidar la ruta de sucursales
        revalidatePath('/admin/production/recipes');
        return {
            error: false,
            message: "Se registró la receta."
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