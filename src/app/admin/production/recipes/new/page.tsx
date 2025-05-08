import { getAuthUser, hasModuleAccess } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
import { CreateMovementInventoryForm } from "@/modules/admin/inventory";
import { CreateRecipeForm } from "@/modules/admin/production-recipes";
import { getProducts } from "@/modules/admin/products";
import { HeaderPage } from "@/modules/admin/shared";
import { getWarehousesResponse } from "@/modules/admin/warehouses";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function NewRecipePage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTION_RECIPES", permissions: [RoleModulePermission.Write] })) redirect("/403");
  // OBTERNER PRODUCTOS
  const productsResponse = await getProducts({ token: authToken, limit: 5, status: 'active' });
  const branchesResponse = await getBranches({ token: authToken });
  const warehousesResponse = await getWarehousesResponse({ token: authToken });
  return (
    <>
      <HeaderPage
        title="Registrar una Receta"
        description="Registra un receta para poner en producción."
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/production/recipes'
        }}
        isButton
        popoverText='Volver a la lista'
        delayPopover={1000}
      />

      <section className="container pt-8">
        <CreateRecipeForm
          token={authToken}
          productsResponse={productsResponse}
          branches={branchesResponse?.branches || []}
          warehouses={warehousesResponse?.warehouses || []}
        />
      </section>
    </>
  );
}