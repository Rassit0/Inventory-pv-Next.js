import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
import { HeaderPage } from "@/modules/admin/shared";
import { getUsersResponse } from "@/modules/admin/users";
import { getWarehousesResponse, WarehouseTable } from "@/modules/admin/warehouses";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function WarehousesPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();

  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "WAREHOUSES", permissions: [RoleModulePermission.Read] })) redirect("/403");

  const warehousesResponse = await getWarehousesResponse({ token: authToken });
  const responseUser = await getUsersResponse({ token: authToken, limit: 0 });
  const branchesResponse = await getBranches({ token: authToken });

  return (
    <>
      <HeaderPage
        title="Almacenes"
        description="Listado de los almacenes del restaurante"
        linkProps={
          hasPermission(user, "WAREHOUSES", RoleModulePermission.Write)
            ? {
              linkText: <Add01Icon />,
              url: "/admin/warehouses/new"
            }
            : undefined
        }
        isButton
        colorButton='primary'
        variantButton='flat'
        popoverText="Nuevo Almacén"
        delayPopover={1000}
      />

      {/* TABLA DE ALMACENES */}
      <WarehouseTable
        editWarehouse={hasPermission(user, "WAREHOUSES", RoleModulePermission.Edit)}
        deleteWarehouse={hasPermission(user, "WAREHOUSES", RoleModulePermission.Delete)}
        token={authToken}
        warehousesResponse={warehousesResponse ?? { meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 }, warehouses: [] }}
        usersResponse={responseUser || { users: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } }}
        branches={branchesResponse?.branches || []}
      />
    </>
  );
}