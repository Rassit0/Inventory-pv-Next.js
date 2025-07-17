import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { BranchTable, getBranchesResponse } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function BranchesPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "BRANCHES", permissions: [RoleModulePermission.Read] })) redirect("/403");

  const branchesResponse = await getBranchesResponse({ token: authToken });
  const usersResponse = await getUsersResponse({ token: authToken });
  return (
    <>
      <HeaderPage
        title="Sucursales"
        description="Listado de tus sucursales del restaurante"
        linkProps={
          hasPermission(user, "BRANCHES", RoleModulePermission.Write)
            ? {
              linkText: <Add01Icon />,
              url: "/admin/branches/new"
            }
            : undefined
        }
        button={{
          popoverText: "Nueva Sucursal",
          delayPopover: 1000,
          colorButton: 'primary',
          variantButton: 'flat'
        }}
      />

      {/* TABLA SUCURSALES */}
      <BranchTable
        token={authToken}
        editBranch={hasPermission(user, "BRANCHES", RoleModulePermission.Edit)}
        deleteBranch={hasPermission(user, "BRANCHES", RoleModulePermission.Delete)}
        branches={branchesResponse?.branches || []}
        users={usersResponse?.users || []}
      />
    </>
  );
}