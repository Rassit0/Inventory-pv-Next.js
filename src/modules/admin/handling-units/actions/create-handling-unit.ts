"use server"

import { isApiError, valeryClient } from "@/lib/api"
import { revalidatePath } from "next/cache"

export const createHanldingUnit = async (formData: FormData) => {
    const data = {
        name: (formData.get("unitName") as string).trim(),
        abbreviation: (formData.get("unitAbbreviation") as string).trim(),
    }
    console.log(data)
    try {
        await valeryClient('/units', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        //Revalidar la ruta de units
        revalidatePath('/admin/handling-units');

        return {
            error: null,
            message: "Se guardo la unidad de manejo"
        }
    } catch (error) {
        if(isApiError(error)){
            return {
                error: true,
                message: error.message,
                response: error.response
            };
            console.log(error)
        }

        // Errores no relacionados con la API
        return {
            error: true,
            message: 'Ha ocurrido un error deconocido'
        }
    }
}