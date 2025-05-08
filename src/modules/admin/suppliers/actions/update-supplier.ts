"use server"
import { isApiError, valeryClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface IResponse {
    error: boolean;
    message: any;
    response?: any;
}

interface Props {
    token: string;
    formData: FormData;
    supplierId: string;
}

export const updateSupplier = async ({ formData, supplierId, token }: Props): Promise<IResponse> => {
    const data = {
        type: formData.get('supplierType'),
        personId: formData.get('supplierPersonId')||undefined,
        name: formData.get('supplierName') || undefined,
        address: formData.get('supplierAddress'),
        city: formData.get('supplierCity'),
        state: formData.get('supplierState'),
        country: formData.get('supplierCountry'),
        zipCode: formData.get('supplierZipCode') || undefined,
        websiteUrl: formData.get('supplierWebsiteUrl') || undefined,
        taxId: formData.get('supplierTaxId') || undefined,
        isActive: formData.get('supplierIsActive') === 'true',
        contactsInfo: formData.getAll('supplierIds').map(contactId => ({
            ...(Number(contactId) > 0 && {
                id: Number(contactId)
            }),
            contactName: formData.get(`contactName[${contactId}]`),
            lastname: formData.get(`contactLastname[${contactId}]`),
            secondLastname: formData.get(`contactSecondLastname[${contactId}]`) !== '' ? formData.get(`contactSecondLastname[${contactId}]`) : undefined,
            email: formData.get(`contactEmail[${contactId}]`) !== '' ? formData.get(`contactEmail[${contactId}]`) : undefined,
            phoneNumber: formData.get(`contactPhoneNumber[${contactId}]`),
            phoneType: formData.get(`contactPhoneType[${contactId}]`),
            position: formData.get(`contactPosition[${contactId}]`),
            isPrimary: formData.get(`contactIsPrimary[${contactId}]`) === 'true',
        })),
    };

    console.log(data);

    try {
        // Realizar la solicitud para actualizar el proveedor
        await valeryClient(`/suppliers/${supplierId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', // Indicar que el cuerpo es un JSON
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data) // Convertir el objeto a una cadena JSON
        });

        // Revalidar la ruta de proveedores
        revalidatePath('/admin/suppliers');

        return {
            error: false,
            message: 'Se actualizó con éxito.'
        }
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message,
            };
        }

        // Manejar errores no relacionados con la API
        return {
            error: true,
            message: 'Ha ocurrido un error desconocido.',
        };
    }

}