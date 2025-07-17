import { getAuthUser, hasModuleAccess } from "@/lib";
import { getBranchesResponse } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUserRoles } from "@/modules/admin/user-roles";
import { CreateUserForm } from "@/modules/admin/users";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();

  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: 'USERS', permissions: [RoleModulePermission.Read, RoleModulePermission.Write] })) redirect("/403");
  const branchesResponse = await getBranchesResponse({ token: authToken });
  const roles = await getUserRoles({ token: authToken });
  return (
    <>
      <HeaderPage
        title="Registrar Usuario"
        description="Formulario de registro y acceso a sucursales."
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/users'
        }}
        button={{
          popoverText: 'Volver a la lista',
          delayPopover: 1000,
          colorButton: 'primary',
          variantButton: 'flat'
        }}
      />

      {/* form para registro */}
      <section className="container pt-8">
        <CreateUserForm
          token={authToken}
          branchesResponse={branchesResponse ?? { meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 }, branches: [] }}
          roles={roles || []}
        // usersResponse={responseUser || { users: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } }}
        // branches={branches || []}
        />
      </section>
    </>
  );
}