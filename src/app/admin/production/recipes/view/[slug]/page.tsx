//snipet prc
import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { findRecipe, ViewRecipe } from "@/modules/admin/production-recipes";
import { HeaderPage } from "@/modules/admin/shared";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
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
            button={{
              popoverText: 'Volver a la lista',
              delayPopover: 1000,
              colorButton: 'primary',
              variantButton: 'flat'
            }}
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
        button={{
          popoverText: 'Volver a la lista',
          delayPopover: 1000,
          colorButton: 'primary',
          variantButton: 'flat',
        }}
      />

      <section className="container pt-8">
        <ViewRecipe recipe={recipe} token={authToken} />
      </section>
    </>
  );
}