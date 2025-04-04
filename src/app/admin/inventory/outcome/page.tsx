import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { HeaderPage } from "@/modules/admin/shared";
import { RoleModulePermission } from "@/modules/auth";
import { Add01Icon } from "hugeicons-react";
import { redirect } from "next/navigation";

export default async function OutcomeInventoryPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "USERS", permissions: [RoleModulePermission.Read] })) redirect("/403");
return (
  <>
    <HeaderPage
      title="Ajustes de Inventario"
      description="Listado de los ajustes realizados a inventarios."
      linkProps={
        hasPermission(user, "INVENTORY_ADJUSTMENT", RoleModulePermission.Write)
          ? {
            linkText: <Add01Icon />,
            url: "/admin/users/new"
          }
          : undefined
      }
      isButton
      colorButton='primary'
      variantButton='flat'
      popoverText="Nuevo Almacén"
      delayPopover={1000}
    />

    {/* TABLA DE USUARIOS */}
  </>
);
}