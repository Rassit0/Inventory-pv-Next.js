import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { UserTable } from "@/modules/admin/users/components/user-table/UserTable";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();

  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "USERS", permissions: [RoleModulePermission.Read] })) redirect("/403");
  const usersResponse = await getUsersResponse({ token: authToken, limit: 10 });
  return (
    <>
      <HeaderPage
        title="Usuarios"
        description="Listado de los usuarios del sistema"
        linkProps={
          hasPermission(user, "USERS", RoleModulePermission.Write)
            ? {
              linkText: <Add01Icon />,
              url: "/admin/users/new"
            }
            : undefined
        }
        isButton
        colorButton='primary'
        variantButton='flat'
        popoverText="Nuevo Usuario"
        delayPopover={1000}
      />

      {/* TABLA DE USUARIOS */}
      {usersResponse && (
        <UserTable
          editUser={hasPermission(user, "USERS", RoleModulePermission.Edit)}
          deleteUser={hasPermission(user, "USERS", RoleModulePermission.Delete)}
          token={authToken}
          usersResponse={usersResponse}
        />
      )}
    </>
  );
}