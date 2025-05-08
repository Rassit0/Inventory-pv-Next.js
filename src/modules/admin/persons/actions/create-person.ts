"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { uploadFile } from "@/utils/upload-file";
import { revalidatePath } from "next/cache";
import { IPerson } from '../interfaces/persons-response';

interface IResponse {
    error: boolean;
    message: any;
    person?: IPerson;
    response?: any;
}

interface Props {
    token: string;
    formData: FormData
}

export const createPerson = async ({ token, formData }: Props): Promise<IResponse> => {
    const file = formData.get("personImage")
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
        name: formData.get('personName'),
        lastname: formData.get('personLastname'),
        secondLastname: formData.get('personSecondLastname') === '' ? undefined : formData.get('personSecondLastname'),
        nit: formData.get('personNit'),
        imageUrl,
        isActive: true,
    };

    console.log(data);

    try {
        // Realizar la solicitud para crear el proveedor
        const response = await valeryClient<{ message: string, person: IPerson }>('/persons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data),
        });

        // // Revalidar la ruta de proveedores
        // revalidatePath('/admin/suppliers');

        return {
            error: false,
            message: 'Se guardo la persona.',
            person: response.person
        }
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
                response: error.response
            }
        }

        return {
            error: true,
            message: 'Ha ocurrido un error desconocido.'
        }
    }
}