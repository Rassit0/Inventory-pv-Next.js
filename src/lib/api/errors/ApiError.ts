export class ApiError extends Error {
    response: any;

    constructor(message: string, response: any) {
        super(message);
        this.name = "ApiError";
        this.response = response;

        
    }
}
// Type Guard para ApiError
export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError && 'response' in error;
}
