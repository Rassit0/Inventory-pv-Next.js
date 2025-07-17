"use server"
import { cookies } from "next/headers";

export async function deleteCookieBranchId() {
    const cookieStore = await cookies();
    cookieStore.delete('branchId');
}
