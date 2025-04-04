import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { HeaderPage } from "@/modules/admin/shared";
import { getSuppliers, SupplierTable } from "@/modules/admin/suppliers";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function SuppliersPage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();

    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "SUPPLIERS", permissions: [RoleModulePermission.Read] })) redirect("/403");

    const suppliers = await getSuppliers({ token: authToken });
    return (
        <>
            <HeaderPage
                title="Proveedores"
                description="Listado de tus proveedores de los productos"
                linkProps={
                    hasPermission(user, "SUPPLIERS", RoleModulePermission.Write)
                        ? {
                            linkText: <Add01Icon />,
                            url: "/admin/suppliers/new"
                        }
                        : undefined
                }
                isButton
                colorButton='primary'
                variantButton='flat'
                popoverText="Nuevo Proveedor"
                delayPopover={1000}
            />

            {/* TABLA PROVEEDORES */}
            <SupplierTable
                token={authToken}
                editContact={hasPermission(user, "SUPPLIERS_CONTACTS", RoleModulePermission.Edit)}
                editSupplier={hasPermission(user, "SUPPLIERS", RoleModulePermission.Edit)}
                deleteSupplier={hasPermission(user, "SUPPLIERS", RoleModulePermission.Delete)}
                suppliers={suppliers || []}
            />
        </>
    );
}