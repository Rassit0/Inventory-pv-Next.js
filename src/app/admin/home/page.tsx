import { getAuthUser, hasModuleAccess } from "@/lib";
import { getProductions, ProductionChart } from "@/modules/admin/production";
import { RoleModulePermission } from "@/modules/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  
  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "HOME", permissions: [RoleModulePermission.Read] })) redirect("/403");

  const productionsResponse = await getProductions({ token: authToken })

  return (
    <div>
      <ProductionChart productions={productionsResponse.productions} />
    </div>
  );
}