import { getAuthUser, hasModuleAccess } from "@/lib";
import { HeaderPage } from "@/modules/admin/shared";
import { getUserRoles } from "@/modules/admin/user-roles";
import { UserRolesTable } from "@/modules/admin/user-roles/components/role-table.ts/UserRolesTable";
import { RoleModulePermission } from "@/modules/auth";
import { redirect } from "next/navigation";

export default async function UserRolesPage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();
    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "PRODUCTS_UNITS", permissions: [RoleModulePermission.Read] })) redirect("/403");
    const roles = await getUserRoles({ token: authToken });
    return (
        <>
            <HeaderPage
                title="Roles de Usuario"
                description="Listado de los roles de usuario"
            />

            {/* TABLA ROLES */}
            <UserRolesTable
                roles={roles || []}
            />

        </>
    );
}