import { getAuthUser, hasModuleAccess, hasPermission } from "@/lib";
import { getParallelGroups, getProductions } from "@/modules/admin/production";
import { OrderList } from "@/modules/admin/production/components/orders/OrderList";
import { HeaderPage } from "@/modules/admin/shared";
import { RoleModulePermission } from "@/modules/auth";
import { redirect } from "next/navigation";

export default async function ProductionOrdersPage() {
  // Obtener usuario autenticado y token
  const { user, authToken } = await getAuthUser();
  
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = new Date().toLocaleString("en-US", { timeZone: systemTimeZone })

  // Verificar acceso al módulo "branches"
  if (!hasModuleAccess({ user, moduleName: "PRODUCTION_ORDERS", permissions: [RoleModulePermission.Read] })) redirect("/403");
  const ordersProductions = await getProductions({ token: authToken, orderBy: "desc", date: new Date(localDate)});
  const parallelGroups = await getParallelGroups({ token: authToken })
  return (
    <>
      {/*HEADER  */}
      <HeaderPage
        title="Ordenes"
        description="Listado de las ordenes de producción"
      />
      <OrderList 
      parallelGroups={parallelGroups} 
      orderProductions={ordersProductions.productions} 
      token={authToken} 
      editOrder={hasPermission(user, "PRODUCTION_ORDERS", RoleModulePermission.Edit)}
      />
    </>
  );
}