import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getBranchesResponse } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUserRoles } from "@/modules/admin/user-roles";
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
  if (!hasModuleAccess({ user, moduleName: "USERS_ROLES", permissions: [RoleModulePermission.Read] })) redirect("/403");
  if (!hasModuleAccess({ user, moduleName: "BRANCHES", permissions: [RoleModulePermission.Read] })) redirect("/403");
  const usersResponse = await getUsersResponse({ token: authToken, limit: 10 });
  const branchesResponse = await getBranchesResponse({ token: authToken });
  const roles = await getUserRoles({ token: authToken });
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
        button={{
          popoverText: "Nuevo Usuario",
          delayPopover: 1000,
          colorButton: 'primary',
          variantButton: 'flat',
        }}
      />

      {/* TABLA DE USUARIOS */}
      {usersResponse && (
        <UserTable
          editUser={hasPermission(user, "USERS", RoleModulePermission.Edit)}
          deleteUser={hasPermission(user, "USERS", RoleModulePermission.Delete)}
          token={authToken}
          usersResponse={usersResponse}
          branchesResponse={branchesResponse ?? { meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 }, branches: [] }}
          roles={roles || []}
        />
      )}
    </>
  );
}