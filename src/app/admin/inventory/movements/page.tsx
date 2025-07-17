import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { EMovementType, getMovementsResponse, InventoryMovementsTable } from "@/modules/admin/inventory";
import { getPersonsResponse } from "@/modules/admin/persons";
import { HeaderPage } from "@/modules/admin/shared";
import { getSuppliersResponse } from "@/modules/admin/suppliers";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function transactionsPage() {
    // Obtener usuario autenticado y token
    const { user, authToken } = await getAuthUser();

    // Verificar acceso al módulo "branches"
    if (!hasModuleAccess({ user, moduleName: "INVENTORY", permissions: [RoleModulePermission.Read] })) redirect("/403");
    if (!hasModuleAccess({ user, moduleName: "PERSONS", permissions: [RoleModulePermission.Read] })) redirect("/403");
    if (!hasModuleAccess({ user, moduleName: "SUPPLIERS", permissions: [RoleModulePermission.Read] })) redirect("/403");
    const personsResponse = await getPersonsResponse({ token: authToken, orderBy: 'asc', columnOrderBy: 'name', limit: 10, page: 1 });
    const suppliersResponse = await getSuppliersResponse({ token: authToken, orderBy: 'asc', columnOrderBy: 'name', limit: 10, page: 1 });

    const movementsResponse = await getMovementsResponse({ token: authToken, limit: 5, movementType: [EMovementType.Income] });
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
                button={{
                    popoverText: "Nuevo Movimiento de Inventario",
                    delayPopover: 1000,
                    colorButton: 'primary',
                    variantButton: 'flat'
                }}
            />

            {/* TABLA DE USUARIOS */}
            <InventoryMovementsTable
                token={authToken}
                itemsResponse={movementsResponse}
                editInventory={hasPermission(user, "INVENTORY", RoleModulePermission.Edit)}
                supplierProps={{
                    create: {
                        createSupplier: hasPermission(user, "SUPPLIERS", RoleModulePermission.Write),
                        createContact: hasPermission(user, "SUPPLIERS_CONTACTS", RoleModulePermission.Write),
                        personsResponse: personsResponse || {
                            persons: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 },
                        }
                    },
                    suppliersResponse: suppliersResponse || {
                        suppliers: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 },
                    },
                }}
            />
        </>
    );
}