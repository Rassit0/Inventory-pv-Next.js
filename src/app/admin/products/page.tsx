//snipet prc
import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getBranches } from "@/modules/admin/branches";
import { getCategories } from "@/modules/admin/categories";
import { getHandlingUnits } from "@/modules/admin/handling-units";
import { getProducts, ProductTable } from "@/modules/admin/products";
import { HeaderPage } from "@/modules/admin/shared";
import { getSuppliersResponse } from "@/modules/admin/suppliers";
import { getWarehousesResponse } from "@/modules/admin/warehouses";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTS", permissions: [RoleModulePermission.Read] })) redirect("/403");

  // OBTERNER PRODUCTOS
  const productsResponse = await getProducts({ token: authToken, limit: 5 }); // Limite de 10 items por pagina
  const categories = await getCategories({ token: authToken });
  const handlingUnits = await getHandlingUnits({ token: authToken });
  const branchesResponse = await getBranches({ token: authToken });
  const suppliers = await getSuppliersResponse({ token: authToken });



  return (
    <>
      {/*HEADER  */}
      <HeaderPage
        title="Productos"
        description="Listado de tus productos en el restaurante"
        linkProps={
          hasPermission(user, "PRODUCTS", RoleModulePermission.Write)
            ? {
              linkText: <Add01Icon />,
              url: "/admin/products/new"
            }
            : undefined
        }
        isButton
        colorButton='primary'
        variantButton='flat'
        popoverText="Nuevo Producto"
        delayPopover={1000}
      />

      {/* TABLA DE PRODUCTOS */}
      <ProductTable
        token={authToken}
        editProduct={hasPermission(user, "PRODUCTS", RoleModulePermission.Edit)}
        deleteProduct={hasPermission(user, "PRODUCTS", RoleModulePermission.Delete)}
        productsResponse={productsResponse}
        categories={categories}
        handlingUnits={handlingUnits}
        branches={branchesResponse?.branches || []}
        suppliers={suppliers || []}
      />
    </>
  );
}