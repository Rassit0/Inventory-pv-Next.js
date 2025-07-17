import { getAuthUser, hasModuleAccess } from "@/lib";
import { CreateHanldinfUnitForm } from "@/modules/admin/handling-units";
import { HeaderPage } from "@/modules/admin/shared";
import { RoleModulePermission } from "@/modules/auth";
import { LinkBackwardIcon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function NewHandlingUnitsPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTS_UNITS", permissions: [RoleModulePermission.Write, RoleModulePermission.Edit] })) redirect("/403");
  return (
    <>
      <HeaderPage
        title="Agregar Unidad de Manejo"
        description="Agrega una nueva unidad de manejo"
        linkProps={{
          linkText: <LinkBackwardIcon />,
          url: '/admin/products/handling-units'
        }}
        button={{
          popoverText: 'Volver a la lista',
          delayPopover: 1000,
          colorButton: 'primary',
          variantButton: 'flat'
        }}
      />
      <section className="container pt-8">
        <CreateHanldinfUnitForm 
        token={authToken}
        />
      </section>
    </>
  );
}