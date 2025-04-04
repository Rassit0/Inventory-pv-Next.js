//snipet prc
import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
import { getCategories } from "@/modules/admin/categories";
import { getHandlingUnits } from "@/modules/admin/handling-units";
import { findRecipe, ViewRecipe } from "@/modules/admin/production-recipes";
import { findProduct, getProducts, ProductTable, ViewProduct } from "@/modules/admin/products";
import { HeaderPage } from "@/modules/admin/shared";
import { getWarehousesResponse } from "@/modules/admin/warehouses";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon, LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function ViewRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTS", permissions: [RoleModulePermission.Read] })) redirect("/403");

  const recipe = await findRecipe({ token: authToken, term: slug });

  // Verificar si no se encontró la receta
  if (!recipe) {
    return (
      (
        <>
          <HeaderPage
            title="Ver Receta"
            description={`Información de la Receta`}
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
      {/*HEADER  */}
      <HeaderPage
        title={recipe.name}
        description={recipe.description || undefined}
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/production/recipes'
        }}
        isButton
        popoverText='Volver a la lista'
        delayPopover={1000}
      />

      <section className="container pt-8">
        <ViewRecipe recipe={recipe} token={authToken} />
      </section>
    </>
  );
}