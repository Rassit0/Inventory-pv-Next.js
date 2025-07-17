import { getAuthUser, hasModuleAccess } from "@/lib";
import { getBranchesResponse } from "@/modules/admin/branches";
import { CreateMovementInventoryForm } from "@/modules/admin/inventory";
import { getPersonsResponse } from "@/modules/admin/persons";
import { getProducts } from "@/modules/admin/products";
import { HeaderPage } from "@/modules/admin/shared";
import { getWarehousesResponse } from "@/modules/admin/warehouses";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function NewTransactionPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "INVENTORY", permissions: [RoleModulePermission.Write] })) redirect("/403");
  // OBTERNER PRODUCTOS
  const productsResponse = await getProducts({ token: authToken, limit: 5, status: 'active' });
  const branchesResponse = await getBranchesResponse({ token: authToken });
  const warehousesResponse = await getWarehousesResponse({ token: authToken });
  const personsResponse = await getPersonsResponse({ token: authToken, orderBy: 'asc', columnOrderBy: 'name', limit: 10, page: 1 });
  return (
    <>
      <HeaderPage
        title="Registrar un Movimiento"
        description="Registra un nuevo movimiento de entrada, ajuste o tranferencia."
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/inventory/movements'
        }}
        button={{
          popoverText: 'Volver a la lista',
          delayPopover: 1000,
          colorButton: 'primary',
          variantButton: 'flat'
        }}
      />

      <section className="container pt-8">
        <CreateMovementInventoryForm
          token={authToken}
          productsResponse={productsResponse}
          branches={branchesResponse?.branches || []}
          warehouses={warehousesResponse?.warehouses || []}
          personsResponse={personsResponse || { persons: [], meta: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } }}
        />
      </section>
    </>
  );
}