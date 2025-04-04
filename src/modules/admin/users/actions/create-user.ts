"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";

interface Props {
    token: string
    formData: FormData
}

export const createUser = async ({ token, formData }: Props) => {
    const file = formData.get("userImage")
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
        name: formData.get("userName"),
        email: formData.get("userEmail"),
        password: formData.get("userPassword"),
        roleId: formData.get("userRoleId"),
        userBranches: formData.getAll("userBranchesIds").map(branchId => ({
            branchId: branchId,
        })),
        imageUrl: imageUrl,
        hasGlobalBranchesAccess: formData.get("hasGlobalBranchesAccess") ? true : false
    }

    console.log(data)

    try {
        // Realizar la solicitud para crear el producto
        await valeryClient('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indicar que el cuerpo es un json
                Authorization: 'Bearer ' + (token ? token : '')
            },
            body: JSON.stringify(data) // Convertir el objeto a una cadena json
        });

        // Revalidar la ruta de productos
        revalidatePath('/admin/users');

        return {
            error: null,
            message: "Se guardo el usuario"
        }
    } catch (error) {
        // Manejar errores de la api
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message // Mostrar mensafe de error específico de la API
            };
        }

        // Manejar otros errores no relacionados con la API
        return {
            error: true,
            message: "Ha ocurrido un error desconocido"
        }
    }
}