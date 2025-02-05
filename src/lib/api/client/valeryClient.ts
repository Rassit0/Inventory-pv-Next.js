import axios from 'axios';
import { ApiError } from '../errors/ApiError';

export const valeryClient = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const token = process.env.TOKEN || ''; // Si el token está almacenado en el entorno o en cookies

    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,  // Permite añadir cabeceras adicionales
    };

    try {
        const response = await fetch(`${process.env.VALERY_API_URL}${url}`, {
            method: options.method || 'GET',
            headers: headers,
            body: options.body ? options.body : undefined, // Si se envían datos en el body
        });

        if (!response.ok) {
            // let errorMessage = `Error desconocido. Código de error: ${response.status}`;
            // try {
            //     // Intentar procesar la respuesta como JSON
            //     const errorJson = await response.json();
            //     errorMessage = errorJson.message || `Error desconocido. Código de error: ${response.status}`;

            //     // Lanza el error con el mensaje adecuado si la respuesta no es exitosa
            //     throw new ApiError(errorMessage, errorJson);
            // } catch (jsonError) {
            //     if (jsonError && typeof jsonError === 'object' && 'response' && 'message' in jsonError) {
            //         // Asegurarse de que 'response' esté presente y sea un objeto JSON
            //         const { message, response } = jsonError as { message: string, response: any };
            //         throw new ApiError(message, response)
            //     }
            //     // Si hay un error al parsear el JSON, asignar un mensaje de error genérico
            //     console.error('Error al parsear la respuesta JSON:', jsonError);
            //     // Si no se puede parsear a JSON, significa que la URL o conexión no es válida
            //     throw new ApiError('No se puede conectar al servidor o la URL no es válida.', response);
            // }
            let errorMessage = `Error desconocido. Código de error: ${response.status}`;
            let errorResponse = null;
            try {
                const errorJSON = await response.json()
                errorMessage = errorJSON.message;
                errorResponse = errorJSON;
            } catch (error) {
                errorMessage = "No se puede conectar al servidor o la URL no es válida."
            }
            throw new ApiError(errorMessage, errorResponse);
        }

        // Intentar procesar la respuesta como JSON si la solicitud es exitosa
        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            console.error(error.message, ': ', error.response);
            throw error; // Re-lanzar el error para ser capturado en otro lugar si es necesario
        } else {
            // console.error('Error desconocido:', error);
            // Lanza un error genérico si no es una instancia de ApiError
            throw new ApiError('No se pudo conectar al servidor. Verifique su conexión a Internet o la URL.', null);
        }
    }
}

