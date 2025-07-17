"use server"
import { cookies } from "next/headers";

export async function setCookieBranchId(branchId: string) {
    const cookieStore = await cookies();

    cookieStore.set('branchId', branchId, {
        path: '/',
        httpOnly: true, // Si necesitas leerla en el cliente
        maxAge: 60 * 60 * 24 * 1, // 1 día
    })
}