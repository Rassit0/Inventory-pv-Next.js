//snipet prc
import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
import { getCategories } from "@/modules/admin/categories";
import { getHandlingUnits } from "@/modules/admin/handling-units";
import { findProduct, getProducts, ProductTable, ViewProduct } from "@/modules/admin/products";
import { HeaderPage } from "@/modules/admin/shared";
import { getWarehousesResponse } from "@/modules/admin/warehouses";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon, LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTS", permissions: [RoleModulePermission.Read] })) redirect("/403");

  const product = await findProduct({ token: authToken, term: slug });

  if (!product) {
    return <div>No hay producto disponible.</div>;
  }

  return (
    <>
      {/*HEADER  */}
      <HeaderPage
        title={product.name}
        description={product.description || undefined}
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/products'
        }}
        isButton
        popoverText='Volver a la lista'
        delayPopover={1000}
      />


      <ViewProduct product={product} term={slug} token={authToken} />
    </>
  );
}