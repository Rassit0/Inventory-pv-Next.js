import { ApiError } from "@/lib/api";

export const uploadFile = async (file: File): Promise<string> => {
    if (!file || file.size === 0) {
        throw new Error("No se proporcionó un archivo válido para subir.");
    }

    const fileFormData = new FormData();
    fileFormData.append("file", file);

    try {
        const response = await fetch(`${process.env.UPLOAD_IMAGE_API_URL}`, {
            method: "POST",
            body: fileFormData
        });

        if (!response.ok) {
            let errorMessage = "Error al subir el archivo.";
            let errorResponse = null;
            try {
                const errorJSON = await response.json()
                errorMessage = errorJSON.message;
                errorResponse = errorJSON;
            } catch (error) {
                errorMessage = "No se puede conectar al servidor o la URL no es válida."
            }
            throw new ApiError("Error al subir el archivo", errorResponse);
        }

        const result = await response.json();
        if (!result.originImage || !result.compressImage) {
            throw new ApiError("La respuesta no contiene la URL del archivo.", null);
        }

        return result.compressImage;
    } catch (error) {
        // console.error("Error en uploadFile:", error);
        throw error;
    }
}