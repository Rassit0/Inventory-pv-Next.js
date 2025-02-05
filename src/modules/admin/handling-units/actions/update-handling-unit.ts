"use server"

import { isApiError, valeryClient } from "@/lib/api"
import { revalidatePath } from "next/cache"

export const updateHandlingUnit = async (formData: FormData, unitId: string) => {
    
    // Preparar los datos para la solicitud
    const data = {
        name: (formData.get("unitName") as string).trim(),
        abbreviation: (formData.get("unitAbbreviation") as string).trim(),
    }
    console.log(data)

    try {
        // Realizar la solicitud para crear la unidad de manejo
        await valeryClient(`/units/${unitId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Revalidar la ruta handling-units
        revalidatePath('/admin/handling-units');

        return {
            error: null,
            message: "Se actualizó la unidad de manejo"
        }
    } catch (error) {
        if(isApiError(error)){
            return{
                error: true,
                message: error.message,
                response: error.response,
            };
        }

        // Manejar otros errores no relacionados con la API
        return {
            error: true,
            message: 'Ha ocurrido un error deconocido'
        }
    }

}