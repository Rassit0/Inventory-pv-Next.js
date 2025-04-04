import { getAuthUser, hasModuleAccess } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { CreateWarehouseForm } from "@/modules/admin/warehouses";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function NewWarehousePage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();

    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: 'WAREHOUSES', permissions: [RoleModulePermission.Write] })) redirect("/403");

    const responseUser = await getUsersResponse({ token: authToken, limit: 0 });
    const branchesResponse = await getBranches({ token: authToken });

    return (
        <>
            <HeaderPage
                title="Agregar Almacén"
                description="Formulario de Registro"
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/warehouses'
                }}
                isButton
                popoverText='Volver a la lista'
                delayPopover={1000}
            />

            <section className="container pt-8">
                <CreateWarehouseForm
                    token={authToken}
                    usersResponse={responseUser || { users: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } }}
                    branches={branchesResponse?.branches || []}
                />
            </section>
        </>
    );
}