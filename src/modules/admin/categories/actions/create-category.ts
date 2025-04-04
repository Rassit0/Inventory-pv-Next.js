"use server"
import { ApiError, isApiError, valeryClient } from "@/lib/api"
import { uploadFile } from "@/utils/upload-file"
import { revalidatePath } from "next/cache"

interface Props {
    token: string;
    formData: FormData;
}

export const createCategory = async ({ formData, token }: Props) => {

    const file = formData.get("image");
    let imageUrl: string | null = null;

    // Subir la imagen solo si hay un archivo
    if (file instanceof File && file.size > 0) {
        try {
            imageUrl = await uploadFile(file); // Obtener la URL del archivo subido
            console.log("imageURL: " + imageUrl);
        } catch (error) {
            // Si ocurre un error al subir la imagen, lanzarlo para manejarlo más adelante
            if (isApiError(error)) {
                return {
                    error: true,
                    message: error.message,  // Mostrar mensaje de error específico de la API
                    response: error.response
                };
            }

            // Manejar otros errores no relacionados con la API
            return {
                error: true,
                message: 'Ha ocurrido un error desconocido'
            };
        }
    }

    // Preparar los datos para la solicitud
    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        parentsHierarchy: formData.getAll("parentIds").map((parentId) => (
            { parentId }
        )),
        imageUrl: imageUrl  // Usar imageUrl en lugar de formData.get("image")
    }
    console.log(data) // Mostrar los datos antes de enviarlos
    try {
        // Realizar la solicitud para crear la categoría
        await valeryClient('/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify(data)  // Convertir el objeto a una cadena JSON
        });

        // Revalidar la ruta de categorías
        revalidatePath('/admin/categories');

        return {
            error: null,
            message: "Se guardo la categoría"
        }
    } catch (error) {
        // console.log(error);
        // Manejar errores de la API
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message  // Mostrar mensaje de error específico de la API
            };
        }

        // Manejar otros errores no relacionados con la API
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido'
        };
    }
}