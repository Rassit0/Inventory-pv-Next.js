"use server"
import { cookies } from "next/headers";

export async function getCookieBranchId() {
  try {
    const cookieStore = await cookies();
    const branchId = cookieStore.get("branchId")?.value;

    return branchId;
  } catch (error) {
    console.log(error);
    return undefined;
  }

}