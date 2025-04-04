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
    formData: FormData
}

export const createSupplier = async ({ token, formData }: Props): Promise<IResponse> => {
    const data = {
        name: formData.get('supplierName'),
        address: formData.get('supplierAddress'),
        city: formData.get('supplierCity'),
        state: formData.get('supplierState'),
        country: formData.get('supplierCountry'),
        zipCode: formData.get('supplierZipCode') || undefined,
        websiteUrl: formData.get('supplierWebsiteUrl') || undefined,
        taxId: formData.get('supplierTaxId') || undefined,
        isActive: formData.get('supplierIsActive') === 'true',
        contactsInfo: formData.getAll('supplierIds').map(contactId => ({
            contactName: formData.get(`contactName[${contactId}]`),
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
        // Realizar la solicitud para crear el proveedor
        await valeryClient('/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(data),
        });

        // Revalidar la ruta de proveedores
        revalidatePath('/admin/suppliers');

        return {
            error: false,
            message: 'Se guardo el proveedor.',
        }
    } catch (error) {
        if (isApiError(error)) {
            return {
                error: true,
                message: error.message
            }
        }

        return {
            error: true,
            message: 'Ha ocurrido un error desconocido.'
        }
    }
}