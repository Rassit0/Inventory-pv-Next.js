"use server"

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}

export const updateWarehouse = async (formData: FormData, warehouseId: string): Promise<IResponse> => {

    const data = {

    };
    return {
        error: false,
        message: 'Se actualizó con éxito.'
    }
}