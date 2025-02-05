"use server"

import { isApiError, valeryClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}

export const deleteSupplier = async (id: string): Promise<IResponse> => {
    try {
        await valeryClient(`/suppliers/${id}`,{
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
            }
        });

        revalidatePath('/admin/suppliers');

        return {
            error: false,
            message: 'Se eliminó el proveedor',
        }
    } catch (error) {
        if(isApiError(error)){
            return{
                error: true,
                message: error.message,
                response: error.response
            }
        }

        // Manejo de otros errores no ApiError si es necesario
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido.'
        }
    }
}