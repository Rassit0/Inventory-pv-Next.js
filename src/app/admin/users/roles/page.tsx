import { HeaderPage } from "@/modules/admin/shared";
import { getUserRoles } from "@/modules/admin/user-roles";
import { UserRolesTable } from "@/modules/admin/user-roles/components/role-table.ts/UserRolesTable";

export default async function UserRolesPage() {

    const roles = await getUserRoles();
    return (
        <>
            <HeaderPage
                title="Roles de Usuario"
                description="Listado de los roles de usuario"
                linkProps={{
                    linkText: 'Nuevo Rol',
                    url: '/admin/users/roles/new'
                }}
            />

            {/* TABLA ROLES */}
            <UserRolesTable
                roles={roles || []}
            />

        </>
    );
}