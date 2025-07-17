"use server"
import { valeryClient } from "@/lib/api";
import { authVerifyToken, IUser } from "@/modules/auth";
import { getRoleById } from "@/modules/auth/actions/get-role-by-id";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IBranch } from "../../interfaces/branch-response";

export async function getCookieBranch(token: string) {
  try {
    const cookieStore = await cookies();
    const branchId = cookieStore.get("branchId")?.value;

    if (!branchId) {
      return undefined;
    }

    // Construir la URL con los parámetros de consulta
    const url = `/branches/${branchId}`;

    const response = await valeryClient<IBranch>(url, {
      headers: {
        Authorization: 'Bearer ' + token
      },
    });

    // COnvertir las fechas a objeros Date
    const branch = {
      ...response,
      warehouses: response.warehouses.map(warehouse => ({
        ...warehouse,
        createdAt: new Date(warehouse.createdAt),
        updatedAt: new Date(warehouse.updatedAt)
      })),
      createdAt: new Date(response.createdaAt),
      updatedAt: new Date(response.updatedAt)
    };

    return branch;
  } catch (error) {
    console.log(error);
    return undefined;
  }

}