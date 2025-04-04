import { getAuthUser, hasModuleAccess } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
import { CreateTransactionForm } from "@/modules/admin/inventory";
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
  const branchesResponse = await getBranches({ token: authToken });
  const warehousesResponse = await getWarehousesResponse({ token: authToken });
  return (
    <>
      <HeaderPage
        title="Registrar un Movimiento"
        description="Registra un nuevo movimiento de entrada, ajuste o tranferencia."
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/inventory/movements'
        }}
        isButton
        popoverText='Volver a la lista'
        delayPopover={1000}
      />

      <section className="container pt-8">
        <CreateTransactionForm
          token={authToken}
          productsResponse={productsResponse}
          branches={branchesResponse?.branches || []}
          warehouses={warehousesResponse?.warehouses || []}
        />
      </section>
    </>
  );
}