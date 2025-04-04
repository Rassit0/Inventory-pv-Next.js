import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getHandlingUnits, HanldinglUnitTable } from "@/modules/admin/handling-units";
import { HeaderPage } from "@/modules/admin/shared";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function HandlingUnitsPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTS_UNITS", permissions: [RoleModulePermission.Read] })) redirect("/403");

  const handlingUnits = await getHandlingUnits({ token: authToken });

  return (
    <div>
      <>
        {/* HEADER */}
        <HeaderPage
          title="Unidades de Manejo"
          description="Listado de las unidades de manejo de los productos"
          linkProps={
            hasPermission(user, "PRODUCTS_UNITS", RoleModulePermission.Write)
              ? {
                linkText: <Add01Icon />,
                url: "/admin/products/handling-units/new"
              }
              : undefined
          }
          isButton
          colorButton='primary'
          variantButton='flat'
          popoverText="Nueva Unidad"
          delayPopover={1000}
        />

        {/* TABLA DE UNIDADES */}
        <HanldinglUnitTable
          editUnit={hasPermission(user, "PRODUCTS_UNITS", RoleModulePermission.Edit)}
          deleteUnit={hasPermission(user, "PRODUCTS_UNITS", RoleModulePermission.Delete)}
          units={handlingUnits}
          token={authToken} />
      </>
    </div>
  );
}