import { getAuthUser, hasModuleAccess } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
import { findRecipe, UpdateRecipeForm } from "@/modules/admin/production-recipes";
import { getProducts } from "@/modules/admin/products";
import { HeaderPage } from "@/modules/admin/shared";
import { getWarehousesResponse } from "@/modules/admin/warehouses";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ recipeId: string }>
}) {
  const { recipeId } = await params
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTION_RECIPES", permissions: [RoleModulePermission.Write, RoleModulePermission.Edit] })) redirect("/403");
  // OBTERNER PRODUCTOS
  const productsResponse = await getProducts({ token: authToken, limit: 5, status: 'active' });
  const branchesResponse = await getBranches({ token: authToken });
  const warehousesResponse = await getWarehousesResponse({ token: authToken });
  const recipe = await findRecipe({ term: recipeId, token: authToken });

  // Verificar si no se encontró la receta
  if (!recipe) {
    return (
      (
        <>
          <HeaderPage
            title="Editar Receta"
            description={`Actualiza la información de la receta`}
            linkProps={{
              linkText: <LinkBackwardIcon />,
              url: '/admin/production/recipes'
            }}
            isButton
            popoverText='Volver a la lista'
            delayPopover={1000}
          />
          <div className="container pt-8">
            <p className="text-red-500">Receta no encontrada.</p>
          </div>
        </>
      )
    );
  }

  return (
    <>
      <HeaderPage
        title="Editar Receta"
        description={`Actualiza la información de la receta ${recipe?.name}`}
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/production/recipes'
        }}
        isButton
        popoverText='Volver a la lista'
        delayPopover={1000}
      />

      <section className="container pt-8">
        <UpdateRecipeForm
          token={authToken}
          recipe={recipe}
          productsResponse={productsResponse}
          branches={branchesResponse?.branches || []}
          warehouses={warehousesResponse?.warehouses || []}
        />
      </section>
    </>
  );
}