import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getMovementsResponse, InventoryMovementsTable } from "@/modules/admin/inventory";
import { HeaderPage } from "@/modules/admin/shared";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function transactionsPage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();

    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "INVENTORY", permissions: [RoleModulePermission.Read] })) redirect("/403");

    const movementsResponse = await getMovementsResponse({ token: authToken, limit: 5 , movementType:['INCOME']});
    return (
        <>
            <HeaderPage
                title="Movimientos de Inventario"
                description="Listado de las movimientos de inventario (entradas, transferencias, ajustes)."
                linkProps={
                    hasPermission(user, "INVENTORY", RoleModulePermission.Write)
                        ? {
                            linkText: <Add01Icon />,
                            url: "/admin/inventory/movements/new"
                        }
                        : undefined
                }
                isButton
                colorButton='primary'
                variantButton='flat'
                popoverText="Nuevo Almacén"
                delayPopover={1000}
            />

            {/* TABLA DE USUARIOS */}
            <InventoryMovementsTable
                token={authToken}
                movementsResponse={movementsResponse}
                editInventory={hasPermission(user, "INVENTORY", RoleModulePermission.Edit)}
            />
        </>
    );
}