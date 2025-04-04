"use server"
import { authVerifyToken, IUser } from "@/modules/auth";
import { getRoleById } from "@/modules/auth/actions/get-role-by-id";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  // Validar si el token existe
  if (!authToken) redirect("/auth/login");
  const { session } = await authVerifyToken(authToken);
  if (!session || !session.token) {
    console.log("Token inválido o inexistente");
    redirect("/auth/login");
  }

  // Validar estructura del token
  const tokenParts = session.token.split(".");
  if (tokenParts.length !== 3) redirect("/auth/login");

  // Decodificar payload del token
  let user: IUser | null = null;
  try {
    user = JSON.parse(atob(tokenParts[1])) as IUser;
    const role = await getRoleById({ token: session.token, roleId: user.roleId });
    user = {
      ...user,
      role
    }
  } catch {
    redirect("/auth/login");
  }

  return { user, authToken };

}