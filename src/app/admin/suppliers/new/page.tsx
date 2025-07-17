import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getPersonsResponse } from "@/modules/admin/persons";
import { HeaderPage } from "@/modules/admin/shared";
import { CreateSupplierForm } from "@/modules/admin/suppliers";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function NewSupplierPage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();
    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "SUPPLIERS_CONTACTS", permissions: [RoleModulePermission.Write] })) redirect("/403");
    const personsResponse = await getPersonsResponse({ token: authToken, orderBy: 'asc', columnOrderBy: 'name', limit: 10, page: 1 });
    return (
        <>
            <HeaderPage
                title="Registrar nuevo proveedor"
                description="Registra un nuevo proveedor para los productos del restaurante"
                linkProps={{
                    linkText: <LinkBackwardIcon />,
                    url: '/admin/suppliers'
                }}
                button={{
                    popoverText: 'Volver a la lista',
                    delayPopover: 1000,
                    colorButton: 'primary',
                    variantButton: 'flat'
                }}
            />

            <section className="container pt-8">
                <CreateSupplierForm
                    token={authToken}
                    createContact={hasPermission(user, "SUPPLIERS_CONTACTS", RoleModulePermission.Write)}
                    personsResponse={personsResponse || { persons: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } }}
                />
            </section>
        </>
    );
}